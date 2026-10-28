import React, { useState, useEffect } from 'react';
import { ReminderConfig, RingtoneType } from '../../types';
import {
  reminderService,
  RINGTONE_OPTIONS,
  playRingtoneOnce,
  stopAlarmLoop,
  unlockAudio,
} from '../../services/reminderService';
import { Hourglass3D } from '../3d/Hourglass3D';
import {
  Bell,
  Clock,
  Globe,
  Volume2,
  VolumeX,
  Play,
  Square,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
  Info,
  Sliders,
  Zap
} from 'lucide-react';

interface ReminderCenterProps {
  config: ReminderConfig;
  onUpdateConfig: (newConfig: ReminderConfig) => Promise<void>;
  hasTodayEntry: boolean;
  onOpenTodayModal: () => void;
  onTriggerAlarmTest?: () => void;
}

export const ReminderCenter: React.FC<ReminderCenterProps> = ({
  config,
  onUpdateConfig,
  hasTodayEntry,
  onOpenTodayModal,
  onTriggerAlarmTest,
}) => {
  const [formData, setFormData] = useState<ReminderConfig>(config);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default' | 'unsupported'>('default');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [playingPreview, setPlayingPreview] = useState<RingtoneType | null>(null);

  // Live ticking clock to make setting and testing alarms effortless
  const [currentLocalTime, setCurrentLocalTime] = useState<string>('');

  useEffect(() => {
    setFormData(config);
    setPermission(reminderService.getBrowserPermissionStatus());

    const updateClock = () => {
      const now = new Date();
      setCurrentLocalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [config]);

  const handleRequestPermission = async () => {
    const res = await reminderService.requestBrowserPermission();
    setPermission(res);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateConfig(formData);
      setSaveMessage('Alarm settings saved successfully!');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick helper: Set alarm for 1 minute from now to test automatic trigger
  const handleSetNextMinute = async () => {
    const next = new Date(Date.now() + 60 * 1000);
    const h = String(next.getHours()).padStart(2, '0');
    const m = String(next.getMinutes()).padStart(2, '0');
    const nextTime = `${h}:${m}`;

    const updated = {
      ...formData,
      enabled: true,
      time: nextTime,
      lastTriggeredDate: null,
      snoozedUntil: null,
    };
    setFormData(updated);
    await onUpdateConfig(updated);
    setSaveMessage(`Alarm set for ${nextTime} (1 minute from now)! Wait for it to ring.`);
    setTimeout(() => setSaveMessage(null), 5000);
  };

  const handlePreviewRingtone = async (ringtoneId: RingtoneType) => {
    await unlockAudio();
    if (playingPreview === ringtoneId) {
      stopAlarmLoop();
      setPlayingPreview(null);
      return;
    }

    stopAlarmLoop();
    setPlayingPreview(ringtoneId);
    const duration = playRingtoneOnce(ringtoneId, formData.volume);
    setTimeout(() => {
      setPlayingPreview((curr) => (curr === ringtoneId ? null : curr));
    }, duration);
  };

  const handleSnooze = async (minutes: number) => {
    const snoozed = reminderService.snooze(formData, minutes);
    setFormData(snoozed);
    await onUpdateConfig(snoozed);
    setSaveMessage(`Alarm snoozed for ${minutes} minutes.`);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleDismissToday = async () => {
    const dismissed = reminderService.dismissForToday(formData);
    setFormData(dismissed);
    await onUpdateConfig(dismissed);
    setSaveMessage("Alarm dismissed for today.");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const formatted12h = reminderService.formatTime12h(formData.time);

  return (
    <div className="space-y-6">
      {/* Top Banner with 3D Hourglass */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0b1329] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/25">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-lg space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" /> Bedtime Alarm System
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold font-mono">
                Live Time: {currentLocalTime || 'Loading...'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Daily Bedtime Alarm & Ringtones
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Never forget to record your study hours. Set your nightly alarm with 5 high-decibel ringtones that loop continuously until you explicitly stop or snooze.
            </p>

            {/* Today's status alert badge */}
            <div className="pt-2">
              {hasTodayEntry ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Today's study hours are already recorded!
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Today's study entry is missing!
                  </div>
                  <button
                    onClick={onOpenTodayModal}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
                  >
                    Log Today Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3D Hourglass / Clock */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 flex items-center justify-center">
            <Hourglass3D />
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-500" />
                Alarm Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your alarm ringtone, volume level, and bedtime schedule
              </p>
            </div>

            {/* Toggle Enable/Disable */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                {formData.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {/* Time Picker & Quick Next-Minute Test Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Scheduled Daily Alarm Time
                </label>
                <button
                  type="button"
                  onClick={handleSetNextMinute}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  Set for +1 min (Quick Test)
                </button>
              </div>

              <div className="relative">
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Selected: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formatted12h}</span> (supports late-night 1:00 AM, 2:00 AM)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" /> Detected Local Timezone
              </label>
              <input
                type="text"
                readOnly
                value={formData.timezone}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium text-xs cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Synchronized with your device clock ({currentLocalTime}).
              </p>
            </div>
          </div>

          {/* RINGTONE SELECTION GRID (5 distinct ringtones) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-500" />
                Select Alarm Ringtone (5 Options)
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Tap play icon to test sound
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RINGTONE_OPTIONS.map((ringtone) => {
                const isSelected = formData.ringtone === ringtone.id;
                const isPlaying = playingPreview === ringtone.id;

                return (
                  <div
                    key={ringtone.id}
                    onClick={() => setFormData({ ...formData, ringtone: ringtone.id })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/70 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                        {ringtone.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {ringtone.name}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {ringtone.description}
                        </p>
                      </div>
                    </div>

                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewRingtone(ringtone.id);
                      }}
                      className={`p-2 rounded-xl transition ${
                        isPlaying
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-600'
                      }`}
                      title={isPlaying ? 'Stop preview' : 'Listen to ringtone'}
                    >
                      {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LOUDNESS & VOLUME CONTROL SLIDER */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                Alarm Sound Volume
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                {Math.round(formData.volume * 100)}% (Loud & Audible)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <VolumeX className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={formData.volume}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  setFormData({ ...formData, volume: vol });
                }}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <Volume2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              High-decibel synthesized audio ensures you hear the alarm clearly even from across the room.
            </p>
          </div>

          {/* Sound & Notifications Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {formData.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">
                    Continuous Ringing
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Sounds until you press Stop
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.soundEnabled}
                onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="text-xs font-bold block text-slate-900 dark:text-white">
                    Desktop Push Alerts
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Browser native notification
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.browserNotifications}
                onChange={(e) => setFormData({ ...formData, browserNotifications: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </div>
          </div>

          {/* Custom Reminder Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Custom Alarm Message
            </label>
            <input
              type="text"
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              maxLength={120}
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (onTriggerAlarmTest) {
                  onTriggerAlarmTest();
                } else {
                  handlePreviewRingtone(formData.ringtone);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white shadow-md shadow-rose-500/20 transition transform active:scale-95"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Test Real Alarm Now (Live Continuous Ring)</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Alarm Preferences'}
            </button>
          </div>

          {saveMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold animate-in fade-in">
              {saveMessage}
            </div>
          )}
        </form>

        {/* Right Column: Permission Manager & Snooze Controls */}
        <div className="space-y-6">
          {/* Permission Card */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              Desktop Push Status
            </h4>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                <span
                  className={`font-bold capitalize px-2 py-0.5 rounded-md ${
                    permission === 'granted'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : permission === 'denied'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {permission}
                </span>
              </div>
            </div>

            {permission !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
              >
                Request Browser Permission
              </button>
            )}

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1">
              <p className="flex items-start gap-1">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400 mt-0.5" />
                The alarm rings continuously until you click "Stop Alarm".
              </p>
              <p className="text-[10px] opacity-75">
                Current Time: <span className="font-mono font-bold">{currentLocalTime}</span>
              </p>
            </div>
          </div>

          {/* Quick Snooze & Dismiss Controls */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-indigo-500" />
              Quick Actions for Today
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need more study time tonight? Snooze the alarm or silence it once done.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSnooze(10)}
                className="py-1.5 px-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
              >
                +10 min
              </button>
              <button
                type="button"
                onClick={() => handleSnooze(30)}
                className="py-1.5 px-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
              >
                +30 min
              </button>
              <button
                type="button"
                onClick={() => handleSnooze(60)}
                className="py-1.5 px-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
              >
                +1 hour
              </button>
            </div>

            <button
              type="button"
              onClick={handleDismissToday}
              className="w-full py-2 px-3 text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Dismiss Alarm For Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
