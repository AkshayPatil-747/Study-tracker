import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-supabase-url.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage keys for local offline fallback
export const LOCAL_STORAGE_KEYS = {
  USERS: 'study_tracker_users',
  CURRENT_USER: 'study_tracker_current_user',
  ENTRIES: 'study_tracker_entries',
  REMINDERS: 'study_tracker_reminders',
  SETTINGS: 'study_tracker_settings',
};
