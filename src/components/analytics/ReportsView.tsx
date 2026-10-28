import React, { useState, useMemo } from 'react';
import { StudyEntry } from '../../types';
import { getLocalDateString } from '../../services/studyService';
import { Award, TrendingUp, TrendingDown, Calendar, CheckCircle2, Star, Sparkles } from 'lucide-react';

interface ReportsViewProps {
  entries: StudyEntry[];
  calendarYears: number[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ entries, calendarYears }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const todayStr = getLocalDateString();
  const today = new Date();

  // Map of date -> hours
  const dateMap = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach(e => map.set(e.date, (map.get(e.date) || 0) + e.hours));
    return map;
  }, [entries]);

  // Report calculations
  const reportData = useMemo(() => {
    if (period === 'weekly') {
      // Current week (Mon-Sun)
      const dayOfWeek = (today.getDay() + 6) % 7;
      const curMon = new Date(today);
      curMon.setDate(today.getDate() - dayOfWeek);
      curMon.setHours(0, 0, 0, 0);

      // Previous week
      const prevMon = new Date(curMon);
      prevMon.setDate(curMon.getDate() - 7);

      let currentTotal = 0;
      let currentDays = 0;
      let prevTotal = 0;
      let maxDay: { date: string; hours: number } | null = null;

      for (let i = 0; i < 7; i++) {
        const d = new Date(curMon);
        d.setDate(curMon.getDate() + i);
        const dStr = getLocalDateString(d);
        const h = dateMap.get(dStr) || 0;
        if (h > 0) {
          currentTotal += h;
          currentDays++;
          if (!maxDay || h > maxDay.hours) {
            maxDay = { date: dStr, hours: h };
          }
        }

        const pd = new Date(prevMon);
        pd.setDate(prevMon.getDate() + i);
        const pdStr = getLocalDateString(pd);
        const ph = dateMap.get(pdStr) || 0;
        if (ph > 0) {
          prevTotal += ph;
        }
      }

      const diff = currentTotal - prevTotal;
      const pct = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(1) : currentTotal > 0 ? '+100' : '0';

      return {
        label: 'Current Week Report',
        periodDesc: `${getLocalDateString(curMon)} to ${getLocalDateString(new Date(curMon.getTime() + 6 * 86400000))}`,
        currentTotal,
        currentDays,
        dailyAverage: currentDays > 0 ? (currentTotal / 7).toFixed(1) : '0',
        activeDaysAverage: currentDays > 0 ? (currentTotal / currentDays).toFixed(1) : '0',
        prevTotal,
        diff,
        pct,
        maxDay,
      };
    } else if (period === 'monthly') {
      // Current Month
      const curYear = today.getFullYear();
      const curMonth = today.getMonth();
      const prefix = `${curYear}-${String(curMonth + 1).padStart(2, '0')}`;

      // Previous month
      const prevMonthDate = new Date(curYear, curMonth - 1, 1);
      const prevPrefix = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

      let currentTotal = 0;
      let currentDays = 0;
      let prevTotal = 0;
      let maxDay: { date: string; hours: number } | null = null;

      entries.forEach(e => {
        if (e.date.startsWith(prefix)) {
          currentTotal += e.hours;
          currentDays++;
          if (!maxDay || e.hours > maxDay.hours) {
            maxDay = { date: e.date, hours: e.hours };
          }
        } else if (e.date.startsWith(prevPrefix)) {
          prevTotal += e.hours;
        }
      });

      const totalDaysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
      const diff = currentTotal - prevTotal;
      const pct = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(1) : currentTotal > 0 ? '+100' : '0';

      return {
        label: 'Current Month Report',
        periodDesc: `${today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
        currentTotal,
        currentDays,
        dailyAverage: (currentTotal / totalDaysInMonth).toFixed(1),
        activeDaysAverage: currentDays > 0 ? (currentTotal / currentDays).toFixed(1) : '0',
        prevTotal,
        diff,
        pct,
        maxDay,
      };
    } else {
      // Yearly Report
      const curYear = calendarYears.includes(today.getFullYear()) ? today.getFullYear() : calendarYears[0];
      const prefix = `${curYear}-`;
      const prevYear = curYear - 1;
      const prevPrefix = `${prevYear}-`;

      let currentTotal = 0;
      let currentDays = 0;
      let prevTotal = 0;
      let maxDay: { date: string; hours: number } | null = null;

      entries.forEach(e => {
        if (e.date.startsWith(prefix)) {
          currentTotal += e.hours;
          currentDays++;
          if (!maxDay || e.hours > maxDay.hours) {
            maxDay = { date: e.date, hours: e.hours };
          }
        } else if (e.date.startsWith(prevPrefix)) {
          prevTotal += e.hours;
        }
      });

      const diff = currentTotal - prevTotal;
      const pct = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(1) : currentTotal > 0 ? '+100' : '0';

      return {
        label: `Academic Year ${curYear} Report`,
        periodDesc: `12 Months of ${curYear}`,
        currentTotal,
        currentDays,
        dailyAverage: (currentTotal / 365).toFixed(1),
        activeDaysAverage: currentDays > 0 ? (currentTotal / currentDays).toFixed(1) : '0',
        prevTotal,
        diff,
        pct,
        maxDay,
      };
    }
  }, [period, entries, dateMap, today, calendarYears]);

  // Milestone Badges calculation
  const totalHoursEver = useMemo(() => entries.reduce((acc, cur) => acc + cur.hours, 0), [entries]);
  const milestones = [
    { name: 'First Step', desc: 'Logged first study session', achieved: entries.length >= 1, icon: '🌱' },
    { name: 'Consistency Starter', desc: 'Logged 7 unique days', achieved: dateMap.size >= 7, icon: '🔥' },
    { name: 'Focus Cadet', desc: 'Completed 25+ study hours', achieved: totalHoursEver >= 25, icon: '⭐' },
    { name: 'Century Club', desc: 'Completed 100+ study hours', achieved: totalHoursEver >= 100, icon: '🏆' },
    { name: 'Scholar Elite', desc: 'Completed 250+ study hours', achieved: totalHoursEver >= 250, icon: '👑' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Performance & Comparative Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated progress tracking and historical period comparisons
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                period === p
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hours */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Total Study Hours</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {reportData.currentTotal} <span className="text-sm font-semibold text-slate-500">hours</span>
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold">
            {reportData.diff >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +{reportData.diff}h ({reportData.pct}%)
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> {reportData.diff}h ({reportData.pct}%)
              </span>
            )}
            <span className="text-slate-400 font-normal ml-1.5">vs previous period</span>
          </div>
        </div>

        {/* Days Logged */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Days with Recorded Study</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {reportData.currentDays} <span className="text-sm font-semibold text-slate-500">days</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Active Study Days logged
          </p>
        </div>

        {/* Daily Average */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Average Study Hours</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {reportData.activeDaysAverage} <span className="text-sm font-semibold text-slate-500">hrs/active day</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {reportData.dailyAverage} hrs/day over entire period
          </p>
        </div>

        {/* Most Productive Day */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span>Peak Focus Day</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          {reportData.maxDay ? (
            <div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {reportData.maxDay.hours} <span className="text-sm font-semibold text-slate-500">hours</span>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 truncate">
                On {reportData.maxDay.date}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-lg font-bold text-slate-400">No data</div>
              <p className="mt-2 text-xs text-slate-400">Start logging to see peak days</p>
            </div>
          )}
        </div>
      </div>

      {/* Consistency & Milestones Section */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🏆</span> Study Milestones & Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                m.achieved
                  ? 'bg-gradient-to-br from-indigo-50/80 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                  : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">{m.icon}</div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.desc}</p>
              <div className="mt-2">
                {m.achieved ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">In Progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
