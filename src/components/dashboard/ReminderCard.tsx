import React from 'react';
import { ReminderConfig } from '../../types';
import { reminderService } from '../../services/reminderService';
import { Bell, BellOff, Clock, CheckCircle2, AlertTriangle, ArrowRight, Settings } from 'lucide-react';

interface ReminderCardProps {
  config: ReminderConfig;
  hasTodayEntry: boolean;
  onOpenTodayModal: () => void;
  onNavigateToReminders: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  config,
  hasTodayEntry,
  onOpenTodayModal,
  onNavigateToReminders,
}) => {
  const formattedTime = reminderService.formatTime12h(config.time);

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`p-2 rounded-xl flex items-center justify-center ${
                config.enabled
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {config.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Study Reminder
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bedtime notification alarm
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToReminders}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Configure Reminders"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Schedule & Timezone Info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-xs mb-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Alarm Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                config.enabled
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {config.enabled ? 'ACTIVE' : 'MUTED'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-500" /> Scheduled Time:
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formattedTime}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Timezone:</span>
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {config.timezone}
            </span>
          </div>
        </div>

        {/* Today's Log Status Pill */}
        <div className="mb-4">
          {hasTodayEntry ? (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Today's study entry completed!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>Today's study entry is missing!</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div>
        {!hasTodayEntry ? (
          <button
            onClick={onOpenTodayModal}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition"
          >
            <span>Log Today's Study Hours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onNavigateToReminders}
            className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition"
          >
            Manage Reminder Preferences
          </button>
        )}
      </div>
    </div>
  );
};
