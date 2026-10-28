export interface User {
  id: string;
  email: string;
  fullName: string;
  loginYear: number;
  calendarStartYear: number;
  targetDailyHours?: number;
  createdAt: string;
}

export interface StudyEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  hours: number; // 1 to 15
  subject?: string;
  notes?: string;
  updatedAt: string;
}

export type RingtoneType = 'classic_alarm' | 'melodic_bell' | 'gentle_marimba' | 'electronic_pulse' | 'cosmic_synth';

export interface RingtoneOption {
  id: RingtoneType;
  name: string;
  description: string;
  icon: string;
}

export interface ReminderConfig {
  userId: string;
  enabled: boolean;
  time: string; // HH:MM (24-hour) e.g. "22:30" or "01:30"
  timezone: string; // e.g. "Asia/Kolkata"
  soundEnabled: boolean;
  ringtone: RingtoneType; // 1 of 5 selected ringtones
  volume: number; // 0.1 to 1.0 (default 0.85 for loud clear alert)
  browserNotifications: boolean;
  emailNotifications: boolean;
  customMessage: string;
  snoozedUntil?: string | null; // ISO timestamp
  lastTriggeredDate?: string | null; // YYYY-MM-DD
}

export interface Festival {
  name: string;
  date: string; // YYYY-MM-DD
  category: 'national_holiday' | 'major_festival' | 'regional_festival';
  description: string;
  color: string;
  icon?: string;
}

export type ViewTab = 'dashboard' | 'calendar' | 'analytics' | 'reports' | 'reminders' | 'settings';

export interface CalendarRange {
  startYear: number;
  endYear: number;
  years: number[];
}

export interface AnalyticsSummary {
  totalHours: number;
  todayHours: number;
  weeklyHours: number;
  monthlyHours: number;
  dailyAverage: number;
  currentStreak: number;
  longestStreak: number;
  mostProductiveDay: { date: string; hours: number; dayName: string } | null;
  totalDaysLogged: number;
}
