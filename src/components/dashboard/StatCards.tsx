import React from 'react';
import { AnalyticsSummary } from '../../types';
import { Clock, Calendar, TrendingUp, Flame, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface StatCardsProps {
  stats: AnalyticsSummary;
  onOpenTodayModal: () => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, onOpenTodayModal }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {/* 1. Total Study Hours */}
      <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          <span>Total Hours</span>
          <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {stats.totalHours} <span className="text-xs font-semibold text-slate-400">hrs</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 font-medium">
          {stats.totalDaysLogged} days recorded
        </p>
      </div>

      {/* 2. Today's Hours */}
      <div className="glass-card p-4 rounded-2xl relative overflow-hidden border-indigo-200/50 dark:border-indigo-800/50">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          <span>Today's Hours</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-baseline justify-between">
          <span>
            {stats.todayHours} <span className="text-xs font-semibold text-slate-400">hrs</span>
          </span>
          {stats.todayHours === 0 && (
            <button
              onClick={onOpenTodayModal}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Log
            </button>
          )}
        </div>
        <p className="mt-1 text-[10px] text-slate-400 font-medium">
          {stats.todayHours > 0 ? 'Goal active' : 'Not recorded yet'}
        </p>
      </div>

      {/* 3. Weekly Hours */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          <span>This Week</span>
          <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <Calendar className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {stats.weeklyHours} <span className="text-xs font-semibold text-slate-400">hrs</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 font-medium">
          Mon – Sun cycle
        </p>
      </div>

      {/* 4. Monthly Hours */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          <span>This Month</span>
          <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {stats.monthlyHours} <span className="text-xs font-semibold text-slate-400">hrs</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 font-medium">
          Current month total
        </p>
      </div>

      {/* 5. Daily Average */}
      <div className="glass-card p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
          <span>Daily Average</span>
          <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <TrendingUp className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {stats.dailyAverage} <span className="text-xs font-semibold text-slate-400">h/day</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 font-medium">
          Per active logged day
        </p>
      </div>

      {/* 6. Current Study Streak */}
      <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/10 border-amber-300/40 dark:border-amber-800/40">
        <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-bold mb-1">
          <span>Study Streak</span>
          <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 animate-pulse">
            <Flame className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
          {stats.currentStreak} <span className="text-xs font-semibold text-slate-500">days 🔥</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Award className="w-3 h-3 text-amber-500" /> Best: {stats.longestStreak} days
        </p>
      </div>
    </div>
  );
};
