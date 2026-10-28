import { StudyEntry, AnalyticsSummary } from '../types';
import { supabase, isSupabaseConfigured, LOCAL_STORAGE_KEYS } from './supabaseClient';

function isSampleEntry(e: StudyEntry): boolean {
  if (!e) return false;
  if (e.id && e.id.startsWith('sample_')) return true;
  if (e.notes && (e.notes.includes('Mastered key modules') || e.notes.includes('Revision and lab work'))) return true;
  return false;
}

function getLocalEntries(): StudyEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.ENTRIES);
    if (!raw) return [];
    const parsed: StudyEntry[] = JSON.parse(raw);
    // Eradicate any mock or sample generated entries
    const clean = parsed.filter(e => !isSampleEntry(e));
    if (clean.length !== parsed.length) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
}

function saveLocalEntries(entries: StudyEntry[]) {
  const clean = entries.filter(e => !isSampleEntry(e));
  localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(clean));
}

// Immediately purge on module load
try {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.ENTRIES);
    if (raw) {
      const parsed: StudyEntry[] = JSON.parse(raw);
      const clean = parsed.filter(e => !isSampleEntry(e));
      localStorage.setItem(LOCAL_STORAGE_KEYS.ENTRIES, JSON.stringify(clean));
    }
  }
} catch {
  // Ignore
}

// Local YYYY-MM-DD date formatter
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const studyService = {
  async getEntries(userId: string): Promise<StudyEntry[]> {
    if (!userId) return [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('study_entries')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (!error && data) {
          return data
            .filter((item: any) => !isSampleEntry(item))
            .map((item: any) => ({
              id: item.id,
              userId: item.user_id,
              date: item.date,
              hours: item.hours,
              subject: item.subject,
              notes: item.notes,
              updatedAt: item.updated_at || item.created_at
            }));
        }
      } catch (err) {
        console.warn('Supabase fetch entries error, using local fallback:', err);
      }
    }

    const all = getLocalEntries();
    // Only return genuine user entries that the user explicitly saved
    return all
      .filter(e => e.userId === userId && !isSampleEntry(e))
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async saveEntry(
    userId: string,
    date: string,
    hours: number,
    subject?: string,
    notes?: string
  ): Promise<{ entry: StudyEntry; isNew: boolean }> {
    const clampedHours = Math.max(1, Math.min(15, Math.round(hours)));
    const nowIso = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existing } = await supabase
          .from('study_entries')
          .select('id')
          .eq('user_id', userId)
          .eq('date', date)
          .single();

        if (existing) {
          const { data, error } = await supabase
            .from('study_entries')
            .update({
              hours: clampedHours,
              subject: subject || null,
              notes: notes || null,
              updated_at: nowIso
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (!error && data) {
            return {
              entry: {
                id: data.id,
                userId: data.user_id,
                date: data.date,
                hours: data.hours,
                subject: data.subject,
                notes: data.notes,
                updatedAt: data.updated_at
              },
              isNew: false
            };
          }
        } else {
          const { data, error } = await supabase
            .from('study_entries')
            .insert({
              user_id: userId,
              date,
              hours: clampedHours,
              subject: subject || null,
              notes: notes || null,
              created_at: nowIso,
              updated_at: nowIso
            })
            .select()
            .single();

          if (!error && data) {
            return {
              entry: {
                id: data.id,
                userId: data.user_id,
                date: data.date,
                hours: data.hours,
                subject: data.subject,
                notes: data.notes,
                updatedAt: data.updated_at
              },
              isNew: true
            };
          }
        }
      } catch (err) {
        console.warn('Supabase save error, falling back to local storage:', err);
      }
    }

    // Local Storage Fallback
    const all = getLocalEntries();
    const existingIndex = all.findIndex(e => e.userId === userId && e.date === date);

    let savedEntry: StudyEntry;
    let isNew = false;

    if (existingIndex >= 0) {
      all[existingIndex] = {
        ...all[existingIndex],
        hours: clampedHours,
        subject: subject || all[existingIndex].subject,
        notes: notes !== undefined ? notes : all[existingIndex].notes,
        updatedAt: nowIso
      };
      savedEntry = all[existingIndex];
      isNew = false;
    } else {
      savedEntry = {
        id: 'entry_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
        userId,
        date,
        hours: clampedHours,
        subject,
        notes,
        updatedAt: nowIso
      };
      all.push(savedEntry);
      isNew = true;
    }

    saveLocalEntries(all);
    return { entry: savedEntry, isNew };
  },

  async deleteEntry(userId: string, dateOrId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const query = supabase.from('study_entries').delete().eq('user_id', userId);
        if (dateOrId.includes('-')) {
          await query.eq('date', dateOrId);
        } else {
          await query.eq('id', dateOrId);
        }
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const all = getLocalEntries();
    const filtered = all.filter(e => !(e.userId === userId && (e.id === dateOrId || e.date === dateOrId)));
    saveLocalEntries(filtered);
    return true;
  },

  async clearAllEntries(userId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('study_entries').delete().eq('user_id', userId);
      } catch (err) {
        console.warn(err);
      }
    }
    const all = getLocalEntries();
    const filtered = all.filter(e => e.userId !== userId);
    saveLocalEntries(filtered);
  },

  calculateStats(entries: StudyEntry[]): AnalyticsSummary {
    const todayStr = getLocalDateString();
    let totalHours = 0;
    let todayHours = 0;
    let weeklyHours = 0;
    let monthlyHours = 0;

    const todayDate = new Date();
    // Monday of current week
    const dayOfWeek = todayDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const currentYearMonth = todayStr.substring(0, 7);

    let maxHoursEntry: StudyEntry | null = null;
    const dateMap = new Map<string, number>();

    for (const entry of entries) {
      totalHours += entry.hours;
      dateMap.set(entry.date, (dateMap.get(entry.date) || 0) + entry.hours);

      if (entry.date === todayStr) {
        todayHours += entry.hours;
      }

      if (entry.date.startsWith(currentYearMonth)) {
        monthlyHours += entry.hours;
      }

      const eDate = new Date(entry.date + 'T00:00:00');
      if (eDate >= startOfWeek && eDate <= endOfWeek) {
        weeklyHours += entry.hours;
      }

      if (!maxHoursEntry || entry.hours > maxHoursEntry.hours) {
        maxHoursEntry = entry;
      }
    }

    const totalDaysLogged = dateMap.size;
    const dailyAverage = totalDaysLogged > 0 ? Number((totalHours / totalDaysLogged).toFixed(1)) : 0;

    // Streaks calculation
    const sortedDates = Array.from(dateMap.keys()).sort();
    let longestStreak = 0;
    let tempStreak = 0;
    let previousDate: Date | null = null;

    for (const dStr of sortedDates) {
      const curDate = new Date(dStr + 'T00:00:00');
      if (previousDate) {
        const diffDays = Math.round((curDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      previousDate = curDate;
    }

    let currentStreak = 0;
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);

    const hasToday = dateMap.has(todayStr);
    const hasYesterday = dateMap.has(getLocalDateString(yesterdayDate));

    if (hasToday || hasYesterday) {
      let iter = new Date(hasToday ? todayDate : yesterdayDate);
      while (dateMap.has(getLocalDateString(iter))) {
        currentStreak++;
        iter.setDate(iter.getDate() - 1);
      }
    }

    let mostProductiveDay = null;
    if (maxHoursEntry) {
      const parts = maxHoursEntry.date.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      mostProductiveDay = {
        date: maxHoursEntry.date,
        hours: maxHoursEntry.hours,
        dayName: dayNames[d.getDay()]
      };
    }

    return {
      totalHours,
      todayHours,
      weeklyHours,
      monthlyHours,
      dailyAverage,
      currentStreak,
      longestStreak,
      mostProductiveDay,
      totalDaysLogged
    };
  }
};
