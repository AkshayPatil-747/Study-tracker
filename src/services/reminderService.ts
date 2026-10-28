import { ReminderConfig, RingtoneType, RingtoneOption } from '../types';
import { supabase, isSupabaseConfigured, LOCAL_STORAGE_KEYS } from './supabaseClient';
import { getLocalDateString } from './studyService';

export const RINGTONE_OPTIONS: RingtoneOption[] = [
  {
    id: 'classic_alarm',
    name: 'Classic Digital Alarm',
    description: 'Crisp, high-decibel double-beep rhythm identical to a digital bedside alarm clock',
    icon: '⏰',
  },
  {
    id: 'melodic_bell',
    name: 'Campus Bell Chime',
    description: 'Resonant, majestic university clock tower bell harmony',
    icon: '🔔',
  },
  {
    id: 'gentle_marimba',
    name: 'Acoustic Marimba',
    description: 'Crisp, uplifting wooden marimba ascending melody',
    icon: '🎵',
  },
  {
    id: 'electronic_pulse',
    name: 'Modern Electronic Pulse',
    description: 'High-energy electronic synthesizer alert with rapid attention attack',
    icon: '⚡',
  },
  {
    id: 'cosmic_synth',
    name: 'Cosmic Knowledge Chime',
    description: 'Futuristic ambient harmony chords designed for deep focus',
    icon: '✨',
  },
];

// Audio Context Singleton & Alarm Loop Controller
let sharedAudioCtx: AudioContext | null = null;
let activeLoopTimer: number | null = null;
let activeOscillators: OscillatorNode[] = [];
let isLoopRunning = false;

export function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn('AudioContext initialization failed:', e);
    return null;
  }
}

export async function unlockAudio(): Promise<boolean> {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx ? ctx.state === 'running' : false;
  } catch (e) {
    return false;
  }
}

// Unlock audio on any user gesture across the application
if (typeof window !== 'undefined') {
  const handleUserInteraction = () => {
    unlockAudio();
  };
  window.addEventListener('click', handleUserInteraction, { passive: true });
  window.addEventListener('touchstart', handleUserInteraction, { passive: true });
  window.addEventListener('keydown', handleUserInteraction, { passive: true });
}

// High-gain synthesized tone generator
function playSingleTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainLevel = 0.9
) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    // Loud, punchy envelope
    const masterGain = Math.max(0.2, Math.min(1.0, gainLevel));
    gain.gain.setValueAtTime(0.001, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(masterGain, ctx.currentTime + startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);

    activeOscillators.push(osc);
    osc.onended = () => {
      activeOscillators = activeOscillators.filter(o => o !== osc);
    };
  } catch (err) {
    console.warn('Error playing tone:', err);
  }
}

/**
 * Play a single iteration of a selected ringtone (with loud, distinct audio)
 */
export function playRingtoneOnce(ringtone: RingtoneType = 'classic_alarm', volume = 0.9): number {
  const ctx = getAudioContext();
  if (!ctx) return 1000;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const vol = Math.max(0.4, Math.min(1.0, volume)); // Loud, clear, audible

  switch (ringtone) {
    case 'classic_alarm': {
      // Classic Loud Digital Bedside Alarm: Beep-Beep! Beep-Beep!
      playSingleTone(ctx, 880, 0, 0.12, 'square', vol * 0.85);
      playSingleTone(ctx, 880, 0.18, 0.12, 'square', vol * 0.85);
      playSingleTone(ctx, 1046.5, 0.45, 0.12, 'square', vol * 0.9);
      playSingleTone(ctx, 1046.5, 0.63, 0.14, 'square', vol * 0.95);
      return 1000;
    }

    case 'melodic_bell': {
      // Resonant campus clock tower bell harmony
      playSingleTone(ctx, 523.25, 0, 0.6, 'sine', vol * 0.9); // C5
      playSingleTone(ctx, 659.25, 0.25, 0.65, 'sine', vol * 0.9); // E5
      playSingleTone(ctx, 783.99, 0.5, 0.7, 'sine', vol * 0.95); // G5
      playSingleTone(ctx, 1046.5, 0.75, 0.9, 'sine', vol * 1.0); // C6
      return 1700;
    }

    case 'gentle_marimba': {
      // Warm, crisp wooden marimba melody
      playSingleTone(ctx, 440.0, 0, 0.22, 'triangle', vol * 0.95);
      playSingleTone(ctx, 554.37, 0.15, 0.22, 'triangle', vol * 0.95);
      playSingleTone(ctx, 659.25, 0.3, 0.22, 'triangle', vol * 0.95);
      playSingleTone(ctx, 880.0, 0.45, 0.25, 'triangle', vol * 1.0);
      playSingleTone(ctx, 1108.7, 0.65, 0.45, 'triangle', vol * 1.0);
      return 1300;
    }

    case 'electronic_pulse': {
      // Modern high-tech synth alert
      playSingleTone(ctx, 750, 0, 0.08, 'sawtooth', vol * 0.75);
      playSingleTone(ctx, 900, 0.12, 0.08, 'sawtooth', vol * 0.8);
      playSingleTone(ctx, 1050, 0.24, 0.08, 'sawtooth', vol * 0.85);
      playSingleTone(ctx, 1200, 0.36, 0.22, 'sawtooth', vol * 0.9);
      playSingleTone(ctx, 900, 0.65, 0.1, 'sawtooth', vol * 0.8);
      playSingleTone(ctx, 1200, 0.78, 0.25, 'sawtooth', vol * 0.9);
      return 1200;
    }

    case 'cosmic_synth':
    default: {
      // Futuristic celestial study chords
      playSingleTone(ctx, 587.33, 0, 0.7, 'sine', vol * 0.85);
      playSingleTone(ctx, 880.0, 0.2, 0.8, 'sine', vol * 0.9);
      playSingleTone(ctx, 1174.66, 0.45, 0.9, 'sine', vol * 0.95);
      playSingleTone(ctx, 1479.98, 0.7, 1.0, 'sine', vol * 0.9);
      return 1600;
    }
  }
}

/**
 * Continuous Alarm Engine: Loops the ringtone continuously until stopAlarmLoop() is called
 */
export function startAlarmLoop(ringtone: RingtoneType = 'classic_alarm', volume = 0.9) {
  stopAlarmLoop();
  isLoopRunning = true;
  unlockAudio();

  const loopCycle = () => {
    if (!isLoopRunning) return;
    const durationMs = playRingtoneOnce(ringtone, volume);
    // Continuous loop with small realistic pause
    activeLoopTimer = window.setTimeout(loopCycle, durationMs + 350);
  };

  loopCycle();
}

/**
 * Stops the continuous alarm ringing immediately
 */
export function stopAlarmLoop() {
  isLoopRunning = false;
  if (activeLoopTimer) {
    clearTimeout(activeLoopTimer);
    activeLoopTimer = null;
  }
  activeOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // Ignore
    }
  });
  activeOscillators = [];
}

export function isAlarmPlaying(): boolean {
  return isLoopRunning;
}

export const reminderService = {
  getSystemTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    } catch {
      return 'Asia/Kolkata';
    }
  },

  getDefaultConfig(userId: string): ReminderConfig {
    return {
      userId,
      enabled: true,
      time: '22:30', // Default bedtime 10:30 PM
      timezone: this.getSystemTimezone(),
      soundEnabled: true,
      ringtone: 'classic_alarm',
      volume: 0.9, // High volume by default
      browserNotifications: true,
      emailNotifications: false,
      customMessage: 'Time to log your daily study hours before sleeping! Stay consistent with your goals.',
      snoozedUntil: null,
      lastTriggeredDate: null,
    };
  },

  async getConfig(userId: string): Promise<ReminderConfig> {
    if (!userId) return this.getDefaultConfig('guest');

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reminder_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return {
            userId: data.user_id,
            enabled: data.enabled ?? true,
            time: data.time || '22:30',
            timezone: data.timezone || this.getSystemTimezone(),
            soundEnabled: data.sound_enabled ?? true,
            ringtone: (data.ringtone as RingtoneType) || 'classic_alarm',
            volume: data.volume ?? 0.9,
            browserNotifications: data.browser_notifications ?? true,
            emailNotifications: data.email_notifications ?? false,
            customMessage: data.custom_message || 'Time to log your daily study hours before sleeping!',
            snoozedUntil: data.snoozed_until,
            lastTriggeredDate: data.last_triggered_date,
          };
        }
      } catch (err) {
        console.warn('Supabase fetch reminder error, fallback to local:', err);
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.REMINDERS);
      if (raw) {
        const parsed: Record<string, ReminderConfig> = JSON.parse(raw);
        if (parsed[userId]) {
          return {
            ...this.getDefaultConfig(userId),
            ...parsed[userId],
          };
        }
      }
    } catch (e) {
      console.warn(e);
    }

    const defaultConf = this.getDefaultConfig(userId);
    this.saveConfig(defaultConf);
    return defaultConf;
  },

  async saveConfig(config: ReminderConfig): Promise<ReminderConfig> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('reminder_settings')
          .upsert({
            user_id: config.userId,
            enabled: config.enabled,
            time: config.time,
            timezone: config.timezone,
            sound_enabled: config.soundEnabled,
            ringtone: config.ringtone,
            volume: config.volume,
            browser_notifications: config.browserNotifications,
            email_notifications: config.emailNotifications,
            custom_message: config.customMessage,
            snoozed_until: config.snoozedUntil,
            last_triggered_date: config.lastTriggeredDate,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } catch (err) {
        console.warn('Supabase save reminder error:', err);
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.REMINDERS);
      const parsed: Record<string, ReminderConfig> = raw ? JSON.parse(raw) : {};
      parsed[config.userId] = config;
      localStorage.setItem(LOCAL_STORAGE_KEYS.REMINDERS, JSON.stringify(parsed));
    } catch (e) {
      console.warn(e);
    }

    return config;
  },

  async requestBrowserPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.error(e);
      return 'denied';
    }
  },

  getBrowserPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  sendBrowserNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) return null;
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          requireInteraction: true,
          ...options,
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        return notif;
      } catch (err) {
        console.warn('Notification construction error:', err);
      }
    }
    return null;
  },

  snooze(config: ReminderConfig, minutes: number): ReminderConfig {
    stopAlarmLoop();
    const snoozedDate = new Date(Date.now() + minutes * 60 * 1000);
    const updated: ReminderConfig = {
      ...config,
      snoozedUntil: snoozedDate.toISOString()
    };
    this.saveConfig(updated);
    return updated;
  },

  dismissForToday(config: ReminderConfig): ReminderConfig {
    stopAlarmLoop();
    const todayStr = getLocalDateString();
    const updated: ReminderConfig = {
      ...config,
      lastTriggeredDate: todayStr,
      snoozedUntil: null
    };
    this.saveConfig(updated);
    return updated;
  },

  formatTime12h(time24: string): string {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  }
};
