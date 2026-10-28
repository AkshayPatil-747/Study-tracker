import { User } from '../types';
import { supabase, isSupabaseConfigured, LOCAL_STORAGE_KEYS } from './supabaseClient';

// Helper to get local users
function getLocalUsers(): (User & { passwordHash?: string })[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: (User & { passwordHash?: string })[]) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Current Year helper
export function getCurrentCalendarYear(): number {
  return new Date().getFullYear();
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async register(email: string, password: string, fullName: string, startYear?: number): Promise<{ user: User | null; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { user: null, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { user: null, error: 'Password must be at least 6 characters.' };
    }
    if (!fullName || fullName.trim().length === 0) {
      return { user: null, error: 'Please enter your name.' };
    }

    const currentYear = getCurrentCalendarYear();
    const calendarStartYear = startYear || currentYear;

    // If Supabase is configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              calendar_start_year: calendarStartYear,
              login_year: currentYear
            }
          }
        });
        if (error) {
          return { user: null, error: error.message };
        }
        if (data.user) {
          const userObj: User = {
            id: data.user.id,
            email: cleanEmail,
            fullName,
            loginYear: currentYear,
            calendarStartYear,
            targetDailyHours: 4,
            createdAt: new Date().toISOString()
          };
          localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userObj));
          return { user: userObj };
        }
      } catch (err: any) {
        console.warn('Supabase sign up error, falling back to local storage:', err);
      }
    }

    // Local Storage offline/fallback implementation
    const users = getLocalUsers();
    if (users.some(u => u.email === cleanEmail)) {
      return { user: null, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User & { passwordHash?: string } = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now(),
      email: cleanEmail,
      fullName: fullName.trim(),
      loginYear: currentYear,
      calendarStartYear,
      targetDailyHours: 4,
      createdAt: new Date().toISOString(),
      passwordHash: btoa(password), // simple reversible storage for local mode
    };

    users.push(newUser);
    saveLocalUsers(users);

    const { passwordHash, ...cleanUser } = newUser;
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(cleanUser));

    return { user: cleanUser };
  },

  async login(email: string, password: string): Promise<{ user: User | null; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { user: null, error: 'Email and password are required.' };
    }

    const currentYear = getCurrentCalendarYear();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) {
          return { user: null, error: error.message };
        }
        if (data.user) {
          const startYear = data.user.user_metadata?.calendar_start_year || currentYear;
          const userObj: User = {
            id: data.user.id,
            email: cleanEmail,
            fullName: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            loginYear: currentYear,
            calendarStartYear: startYear,
            targetDailyHours: data.user.user_metadata?.target_daily_hours || 4,
            createdAt: data.user.created_at || new Date().toISOString()
          };
          localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userObj));
          return { user: userObj };
        }
      } catch (err: any) {
        console.warn('Supabase sign in error, fallback to local storage:', err);
      }
    }

    // Local Storage offline/fallback
    const users = getLocalUsers();
    const existing = users.find(u => u.email === cleanEmail);
    if (!existing) {
      return { user: null, error: 'No account found with this email. Please sign up.' };
    }

    if (existing.passwordHash !== btoa(password)) {
      return { user: null, error: 'Invalid password. Please check and try again.' };
    }

    // Update login year to current year if user didn't have one
    existing.loginYear = currentYear;
    if (!existing.calendarStartYear) {
      existing.calendarStartYear = currentYear;
    }
    saveLocalUsers(users);

    const { passwordHash, ...cleanUser } = existing;
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(cleanUser));

    return { user: cleanUser };
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please provide a valid email.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
        if (error) throw error;
        return { success: true, message: `Password reset instructions sent to ${cleanEmail}.` };
      } catch (err: any) {
        return { success: false, message: err.message || 'Error sending reset email.' };
      }
    }

    const users = getLocalUsers();
    const found = users.some(u => u.email === cleanEmail);
    if (!found) {
      return { success: false, message: 'No registered account found with that email address.' };
    }

    return {
      success: true,
      message: `Password reset link simulated for ${cleanEmail}. In offline demo mode, you can sign in directly or register a new account.`
    };
  },

  updateUser(updates: Partial<User>): User | null {
    const current = this.getCurrentUser();
    if (!current) return null;

    const updated = { ...current, ...updates };
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));

    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveLocalUsers(users);
    }

    return updated;
  }
};
