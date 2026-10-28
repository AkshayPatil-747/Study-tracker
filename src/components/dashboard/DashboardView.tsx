import React, { useState } from 'react';
import { User, StudyEntry, ReminderConfig, AnalyticsSummary } from '../../types';
import { StatCards } from './StatCards';
import { ReminderCard } from './ReminderCard';
import { RecentActivity } from './RecentActivity';
import { StudyUniverse3D } from '../3d/StudyUniverse3D';
import {
  Sparkles,
  Calendar,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Award,
  Target,
  Compass,
  CheckCircle2,
  Quote
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  stats: AnalyticsSummary;
  entries: StudyEntry[];
  calendarYears: number[];
  reminderConfig: ReminderConfig;
  hasTodayEntry: boolean;
  onOpenTodayModal: () => void;
  onSelectDate: (dateStr: string) => void;
  onNavigateToTab: (tab: any) => void;
}

const SCHOLAR_QUOTES = [
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Discipline is the bridge between academic goals and degree accomplishment.", author: "Jim Rohn" },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  stats,
  entries,
  calendarYears,
  reminderConfig,
  hasTodayEntry,
  onOpenTodayModal,
  onSelectDate,
  onNavigateToTab,
}) => {
  const [quoteIdx] = useState(() => Math.floor(Math.random() * SCHOLAR_QUOTES.length));
  const activeQuote = SCHOLAR_QUOTES[quoteIdx];

  const targetDailyHours = user.targetDailyHours || 4;
  const todayProgressPct = Math.min(100, Math.round((stats.todayHours / targetDailyHours) * 100));

  // Determine current academic year tier in the 4-year cycle
  const currentYear = new Date().getFullYear();
  const yearIdx = Math.max(0, calendarYears.indexOf(currentYear));
  const yearTiers = [
    { title: 'Freshman Year', desc: 'Foundations & Discipline' },
    { title: 'Sophomore Year', desc: 'Core Competency & Focus' },
    { title: 'Junior Year', desc: 'Advanced Mastery & Research' },
    { title: 'Senior Scholar', desc: 'Graduation & Excellence' },
  ];
  const currentTier = yearTiers[yearIdx] || yearTiers[0];

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs border border-white/10">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                {currentTier.title} • {currentYear}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" /> 4-Year Academic Cycle ({calendarYears[0]} – {calendarYears[calendarYears.length - 1]})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, Scholar {user.fullName}! 📚
            </h1>

            {/* Daily Quote Box */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-start gap-3">
              <Quote className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-0.5 opacity-80" />
              <div>
                <p className="text-xs sm:text-sm text-indigo-100 italic leading-relaxed">
                  "{activeQuote.text}"
                </p>
                <span className="text-[11px] font-semibold text-indigo-300 block mt-1">
                  — {activeQuote.author}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Quick Actions & Target Widget */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
            {/* Daily Target Progress Card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-200 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Daily Target ({targetDailyHours}h)
                </span>
                <span className="font-extrabold text-white">
                  {stats.todayHours} / {targetDailyHours} hrs
                </span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-indigo-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${todayProgressPct}%` }}
                />
              </div>
              <span className="text-[10px] text-indigo-200 block text-right font-medium">
                {todayProgressPct >= 100 ? '🎉 Daily study goal reached!' : `${todayProgressPct}% of goal achieved`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTodayModal}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{hasTodayEntry ? 'Edit Today\'s Study' : 'Log Today\'s Hours'}</span>
              </button>
              <button
                onClick={() => onNavigateToTab('calendar')}
                className="px-3.5 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1"
                title="View Full Calendar"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <StatCards stats={stats} onOpenTodayModal={onOpenTodayModal} />

      {/* Clean Zero-Data Empty State Guidance (when user has no entries yet) */}
      {entries.length === 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/20 border-2 border-dashed border-indigo-200 dark:border-indigo-800/60 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Welcome to your clean Four-Year Academic Slate!
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            No past records found — exactly as requested. Every hour you log from now on will build your real four-year academic graph, calculate your true study streaks, and unlock scholar milestones.
          </p>
          <div className="pt-1 flex items-center justify-center gap-3">
            <button
              onClick={onOpenTodayModal}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4" /> Log Day 1 Study Session
            </button>
            <button
              onClick={() => onNavigateToTab('calendar')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition"
            >
              Explore Calendar ({calendarYears[0]}–{calendarYears[calendarYears.length - 1]})
            </button>
          </div>
        </div>
      )}

      {/* Middle Grid: Reminder Status Card + 4-Year Journey Universe Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reminder Status Card */}
        <div className="lg:col-span-1">
          <ReminderCard
            config={reminderConfig}
            hasTodayEntry={hasTodayEntry}
            onOpenTodayModal={onOpenTodayModal}
            onNavigateToReminders={() => onNavigateToTab('reminders')}
          />
        </div>

        {/* 4-Year Study Orbit / Journey Card */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
                Four-Year Academic Universe & Stage Progression
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Visualizing your degree path: {calendarYears.map((y, i) => `${y} (${yearTiers[i]?.title || 'Year ' + (i+1)})`).join(' • ')}
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('analytics')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Analytics →
            </button>
          </div>

          {/* Interactive 3D Orbit Canvas */}
          <div className="h-44 sm:h-52 w-full">
            <StudyUniverse3D years={calendarYears} activeYear={currentYear} />
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            {calendarYears.map((yr, idx) => {
              const yrPrefix = `${yr}-`;
              const yrHours = entries
                .filter(e => e.date.startsWith(yrPrefix))
                .reduce((acc, cur) => acc + cur.hours, 0);

              const isCurrent = yr === currentYear;

              return (
                <div
                  key={yr}
                  className={`p-2 rounded-xl transition ${
                    isCurrent
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80'
                      : 'bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {yearTiers[idx]?.title || `Year ${idx + 1}`}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{yr}</span>
                  <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 block">
                    {yrHours}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <RecentActivity
        entries={entries}
        onSelectDate={onSelectDate}
        onOpenTodayModal={onOpenTodayModal}
      />
    </div>
  );
};
