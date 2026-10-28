import React from 'react';
import { ViewTab, ReminderConfig } from '../../types';
import { Menu, Plus, Bell, Sparkles, Sun, Moon } from 'lucide-react';
import { reminderService } from '../../services/reminderService';

interface NavbarProps {
  currentTab: ViewTab;
  onOpenMobileSidebar: () => void;
  onOpenTodayModal: () => void;
  hasTodayEntry: boolean;
  reminderConfig: ReminderConfig;
  onNavigateToReminders: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onOpenTodayModal,
  hasTodayEntry,
  reminderConfig,
  onNavigateToReminders,
  darkMode,
  onToggleDarkMode,
}) => {
  const titles: Record<ViewTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your study hours & streak' },
    calendar: { title: 'Four-Year Calendar', subtitle: 'Interactive 12-month calendar & Indian festival dates' },
    analytics: { title: 'Analytics & Visualizations', subtitle: 'Detailed graphs and multi-year comparison' },
    reports: { title: 'Periodic Reports', subtitle: 'Weekly & monthly study summaries with milestone badges' },
    reminders: { title: 'Daily Study Reminders', subtitle: 'Nightly bedtime alarm settings & notifications' },
    settings: { title: 'Settings', subtitle: 'Profile, academic cycle, and preferences' },
  };

  const currentInfo = titles[currentTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/75 dark:bg-[#0b0f19]/75 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {currentInfo.title}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-400">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Reminder Quick Pill */}
        <button
          onClick={onNavigateToReminders}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 transition"
          title="Reminder settings"
        >
          <Bell className={`w-3.5 h-3.5 ${reminderConfig.enabled ? 'text-indigo-500' : 'text-slate-400'}`} />
          <span>{reminderService.formatTime12h(reminderConfig.time)}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Quick Log Today Button */}
        <button
          onClick={onOpenTodayModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Today</span>
          {hasTodayEntry && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 ml-0.5" title="Logged" />
          )}
        </button>
      </div>
    </header>
  );
};
