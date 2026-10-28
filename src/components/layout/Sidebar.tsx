import React from 'react';
import { ViewTab, User, ReminderConfig } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Award,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  user: User;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  reminderConfig: ReminderConfig;
  calendarRange: number[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  darkMode,
  onToggleDarkMode,
  reminderConfig,
  calendarRange,
}) => {
  const navItems = [
    { id: 'dashboard' as ViewTab, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'calendar' as ViewTab,
      label: '4-Year Calendar',
      icon: Calendar,
      badge: `${calendarRange[0]}–${calendarRange[calendarRange.length - 1]}`,
    },
    { id: 'analytics' as ViewTab, label: 'Analytics', icon: BarChart3 },
    { id: 'reports' as ViewTab, label: 'Weekly & Monthly', icon: Award },
    {
      id: 'reminders' as ViewTab,
      label: 'Reminders',
      icon: Bell,
      indicator: reminderConfig.enabled,
    },
    { id: 'settings' as ViewTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out border-r flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-lg`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-indigo-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight block">
                  Study Tracker
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block -mt-1">
                  {calendarRange[0]}–{calendarRange[calendarRange.length - 1]}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {/* Badge or indicator */}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.indicator && (
                  <span
                    className={`w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 ${
                      isCollapsed ? 'absolute top-2 right-2' : ''
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls: Theme, User snippet & Logout */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        {/* Dark/Light toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition`}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          {!isCollapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User preview & Logout */}
        <div
          className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between ${
            isCollapsed ? 'flex-col gap-2' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {user.email}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
