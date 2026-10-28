import React, { useEffect } from 'react';
import { Bell, Clock, CheckCircle2, Sparkles, X, Volume2, Square } from 'lucide-react';
import { ReminderConfig } from '../../types';
import { startAlarmLoop, stopAlarmLoop, RINGTONE_OPTIONS } from '../../services/reminderService';

interface InAppAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReminderConfig;
  hasTodayEntry: boolean;
  onOpenTodayModal: () => void;
  onSnooze: (minutes: number) => void;
  onDismissToday: () => void;
}

export const InAppAlarmModal: React.FC<InAppAlarmModalProps> = ({
  isOpen,
  onClose,
  config,
  hasTodayEntry,
  onOpenTodayModal,
  onSnooze,
  onDismissToday,
}) => {
  // Start continuous alarm loop when modal opens, stop when it closes
  useEffect(() => {
    if (isOpen && config.soundEnabled) {
      startAlarmLoop(config.ringtone || 'classic_alarm', config.volume ?? 0.85);
    }
    return () => {
      stopAlarmLoop();
    };
  }, [isOpen, config.soundEnabled, config.ringtone, config.volume]);

  if (!isOpen) return null;

  const handleStopAndClose = () => {
    stopAlarmLoop();
    onClose();
  };

  const handleStopAndLog = () => {
    stopAlarmLoop();
    onClose();
    onOpenTodayModal();
  };

  const handleStopAndSnooze = (minutes: number) => {
    stopAlarmLoop();
    onSnooze(minutes);
    onClose();
  };

  const handleStopAndDismiss = () => {
    stopAlarmLoop();
    onDismissToday();
    onClose();
  };

  const currentRingtone = RINGTONE_OPTIONS.find(r => r.id === config.ringtone) || RINGTONE_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-indigo-500/50 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-rose-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="p-7 text-center space-y-5">
          <button
            onClick={handleStopAndClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Stop Alarm & Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Alarm Icon with ringing wave effects */}
          <div className="relative inline-flex items-center justify-center my-1">
            <span className="absolute w-20 h-20 rounded-full bg-rose-500/20 animate-ping" />
            <span className="absolute w-24 h-24 rounded-full bg-indigo-500/15 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/40">
              <Bell className="w-8 h-8 animate-bounce" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>ALARM RINGING CONTINUOUSLY</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Bedtime Study Alarm!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 max-w-sm mx-auto">
              {config.customMessage || 'Time to record your daily study hours before sleeping!'}
            </p>
          </div>

          {/* Audio Indicator Bar */}
          <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Volume2 className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>Playing: {currentRingtone.name} ({currentRingtone.icon})</span>
            </div>
            {/* Animated equalizer bars */}
            <div className="flex items-end gap-1 h-4">
              <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-4" />
              <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.5s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_0.9s_ease-in-out_infinite] h-4" />
            </div>
          </div>

          {/* Status info box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-left">
            {hasTodayEntry ? (
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-semibold">
                  Today's study hours have already been recorded!
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-semibold">
                  Today's study entry is missing! Please record your hours before resting.
                </span>
              </div>
            )}
          </div>

          {/* STOP ALARM BUTTON (Prominent) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleStopAndClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition transform active:scale-98"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Alarm & Silence Ringtone</span>
            </button>
          </div>

          {/* Contextual Actions: Log Hours or Dismiss */}
          <div className="space-y-2">
            {!hasTodayEntry ? (
              <button
                type="button"
                onClick={handleStopAndLog}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                Stop & Log Today's Study Hours
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopAndDismiss}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                Dismiss Alarm for Tonight
              </button>
            )}

            {/* Snooze row */}
            <div className="flex items-center justify-center gap-2 pt-2 text-xs">
              <span className="text-slate-400 font-medium">Snooze:</span>
              <button
                type="button"
                onClick={() => handleStopAndSnooze(10)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition"
              >
                +10m
              </button>
              <button
                type="button"
                onClick={() => handleStopAndSnooze(30)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition"
              >
                +30m
              </button>
              <button
                type="button"
                onClick={() => handleStopAndSnooze(60)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition"
              >
                +1h
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
