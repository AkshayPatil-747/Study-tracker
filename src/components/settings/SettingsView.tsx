import React, { useState } from 'react';
import { User, ReminderConfig } from '../../types';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { studyService } from '../../services/studyService';
import {
  User as UserIcon,
  Calendar,
  Database,
  Volume2,
  Download,
  CheckCircle2,
  ShieldCheck,
  Target,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  reminderConfig: ReminderConfig;
  onUpdateReminder: (cfg: ReminderConfig) => void;
  entriesCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  reminderConfig,
  onUpdateReminder,
  entriesCount,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [startYear, setStartYear] = useState(user.calendarStartYear);
  const [targetHours, setTargetHours] = useState(user.targetDailyHours || 4);
  const [soundEnabled, setSoundEnabled] = useState(reminderConfig.soundEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      fullName: fullName.trim(),
      calendarStartYear: Number(startYear),
      targetDailyHours: Number(targetHours),
    });

    onUpdateReminder({
      ...reminderConfig,
      soundEnabled,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const rawEntries = localStorage.getItem('study_tracker_entries') || '[]';
    const blob = new Blob([rawEntries], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study_tracker_backup_${user.email}_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAllHistory = async () => {
    await studyService.clearAllEntries(user.id);
    setShowClearConfirm(false);
    setClearedNotice(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-indigo-500" />
          Account & Calendar Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal study targets, 4-year academic starting cycle, and preferences
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>👤</span> Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3.5 py-2 text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 4-Year Academic Cycle Configuration */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Rolling 4-Year Calendar Cycle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Starting Year of 4-Year Horizon
              </label>
              <select
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr} (Cycle: {yr} – {yr + 3})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Determines the 4 consecutive calendar years visible on your dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-500" /> Daily Target Study Hours
              </label>
              <select
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((h) => (
                  <option key={h} value={h}>
                    {h} hours per day
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Your personal daily target for tracking consistency.
              </p>
            </div>
          </div>
        </div>

        {/* Audio sound effects */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="text-xs font-bold block text-slate-900 dark:text-white">
                  Audio & Sound Effects
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allow bedtime alarm ringtones and celebration chimes
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/25 transition"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Database & Data Integrity Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-500" />
          Database & Persistence Status
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-5 h-5 ${isSupabaseConfigured ? 'text-emerald-500' : 'text-indigo-500'}`} />
            <div>
              <span className="text-xs font-bold block text-slate-900 dark:text-white">
                {isSupabaseConfigured ? 'Supabase PostgreSQL (Connected)' : 'Local Persistent Storage (Active)'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isSupabaseConfigured
                  ? 'Real-time synchronized with cloud PostgreSQL database.'
                  : 'Isolated multi-user private records persisted locally.'}
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {entriesCount} Records Stored
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Export a copy of all your logged study sessions
          </span>
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>

        {/* Wipe & Fresh Start Danger Zone */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
              Fresh Start (Clear All Study History)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Permanently wipe all past study records and start completely clean
            </span>
          </div>

          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Sure?
              </span>
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                Yes, Delete All
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All History
            </button>
          )}
        </div>

        {clearedNotice && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-bold">
            All study history has been cleared! Refreshing clean slate...
          </div>
        )}
      </div>
    </div>
  );
};
