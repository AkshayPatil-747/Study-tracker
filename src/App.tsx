import React, { useState, useEffect, useMemo } from 'react';
import { User, StudyEntry, ReminderConfig, ViewTab } from './types';
import { authService, getCurrentCalendarYear } from './services/authService';
import { studyService, getLocalDateString } from './services/studyService';
import { reminderService, stopAlarmLoop, startAlarmLoop } from './services/reminderService';

// Layout & View Components
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { InAppAlarmModal } from './components/layout/InAppAlarmModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { FourYearCalendar } from './components/calendar/FourYearCalendar';
import { DayModal } from './components/calendar/DayModal';
import { ProgressCharts } from './components/analytics/ProgressCharts';
import { ReportsView } from './components/analytics/ReportsView';
import { ReminderCenter } from './components/reminders/ReminderCenter';
import { SettingsView } from './components/settings/SettingsView';

// Auto-purge any lingering sample entries from previous sessions
try {
  const raw = localStorage.getItem('study_tracker_entries');
  if (raw && (raw.includes('Mastered key modules') || raw.includes('Revision and lab work') || raw.includes('sample_'))) {
    const parsed = JSON.parse(raw);
    const clean = parsed.filter((e: any) =>
      !e.id?.startsWith('sample_') &&
      !e.notes?.includes('Mastered key modules') &&
      !e.notes?.includes('Revision and lab work')
    );
    localStorage.setItem('study_tracker_entries', JSON.stringify(clean));
  }
} catch {
  // Ignore
}

export const App: React.FC = () => {
  // Current user & authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [authView, setAuthView] = useState<'landing' | 'auth'>('landing');

  // Navigation state
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('study_tracker_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data states - starts with clean real user data (no default fake data injected!)
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>(() =>
    reminderService.getDefaultConfig(currentUser?.id || 'guest')
  );

  // Modals
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [activeModalDate, setActiveModalDate] = useState<string>(getLocalDateString());
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  // Track the exact occurrence fired (e.g. "2026-10-28 14:48") to prevent double firing in the same minute
  const [lastFiredOccurrence, setLastFiredOccurrence] = useState<string>('');

  // Sync Dark mode with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('study_tracker_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('study_tracker_theme', 'light');
    }
  }, [darkMode]);

  // Dynamic 4-Year Calendar range calculation starting from user's calendarStartYear or loginYear
  const calendarRange = useMemo(() => {
    const currentYear = getCurrentCalendarYear();
    const startYear = currentUser?.calendarStartYear || currentUser?.loginYear || currentYear;
    return [startYear, startYear + 1, startYear + 2, startYear + 3];
  }, [currentUser]);

  // Load user data upon authentication - Clean real data only
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      // Fetch ONLY real entries for this user - all previous sample/default entries are purged!
      const fetchedEntries = await studyService.getEntries(currentUser.id);
      setEntries(fetchedEntries);

      // Fetch reminder configuration
      const config = await reminderService.getConfig(currentUser.id);
      setReminderConfig(config);
    };

    loadData();
  }, [currentUser, calendarRange]);

  // Study statistics calculation
  const stats = useMemo(() => {
    return studyService.calculateStats(entries);
  }, [entries]);

  // Map of entries for quick checking
  const entriesDateMap = useMemo(() => {
    const map = new Map<string, StudyEntry>();
    entries.forEach(e => map.set(e.date, e));
    return map;
  }, [entries]);

  const todayStr = getLocalDateString();
  const hasTodayEntry = entriesDateMap.has(todayStr);

  // =========================================================================
  // Recurring Bedtime Alarm & Reminder System
  // =========================================================================
  useEffect(() => {
    if (!currentUser || !reminderConfig.enabled) return;

    const checkAlarm = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const currentDateStr = getLocalDateString(now);
      const currentOccurrence = `${currentDateStr} ${currentTimeStr}`;

      // Check snooze condition
      if (reminderConfig.snoozedUntil) {
        const snoozeDate = new Date(reminderConfig.snoozedUntil);
        if (now < snoozeDate) {
          return; // Still in snooze window
        }
      }

      // Match scheduled alarm time
      if (currentTimeStr === reminderConfig.time) {
        // Prevent repeated firing in the exact same minute
        if (lastFiredOccurrence === currentOccurrence) {
          return;
        }

        // Fire alarm!
        setLastFiredOccurrence(currentOccurrence);

        // Native desktop browser notification
        if (reminderConfig.browserNotifications) {
          reminderService.sendBrowserNotification('Study Tracker: Bedtime Alarm ⏰', {
            body: reminderConfig.customMessage || "Time to record today's study hours before going to bed!",
          });
        }

        // Start continuous audio loop
        if (reminderConfig.soundEnabled) {
          startAlarmLoop(reminderConfig.ringtone || 'classic_alarm', reminderConfig.volume ?? 0.9);
        }

        // Open in-app alarm dialog
        setIsAlarmModalOpen(true);
      }
    };

    // Check every second (1000ms) for prompt, reliable triggering!
    const intervalId = setInterval(checkAlarm, 1000);
    return () => clearInterval(intervalId);
  }, [currentUser, reminderConfig, lastFiredOccurrence]);

  // Entry CRUD handlers
  const handleSaveEntry = async (date: string, hours: number, subject?: string, notes?: string) => {
    if (!currentUser) return;
    const { entry } = await studyService.saveEntry(currentUser.id, date, hours, subject, notes);

    setEntries(prev => {
      const idx = prev.findIndex(e => e.date === date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = entry;
        return updated;
      }
      return [entry, ...prev];
    });
  };

  const handleDeleteEntry = async (date: string) => {
    if (!currentUser) return;
    await studyService.deleteEntry(currentUser.id, date);
    setEntries(prev => prev.filter(e => e.date !== date));
  };

  const handleOpenDayModal = (dateStr: string) => {
    setActiveModalDate(dateStr);
    setIsDayModalOpen(true);
  };

  const handleOpenTodayModal = () => {
    setActiveModalDate(todayStr);
    setIsDayModalOpen(true);
  };

  const handleUpdateReminderConfig = async (newConfig: ReminderConfig) => {
    // If user changed alarm time, reset occurrence check so it can ring on the new time right away!
    if (newConfig.time !== reminderConfig.time) {
      setLastFiredOccurrence('');
    }
    setReminderConfig(newConfig);
    await reminderService.saveConfig(newConfig);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    const updated = authService.updateUser(updates);
    if (updated) {
      setCurrentUser(updated);
    }
  };

  const handleLogout = async () => {
    stopAlarmLoop();
    await authService.logout();
    setCurrentUser(null);
    setAuthView('landing');
  };

  // If user is not logged in: show Landing Page or Auth Page
  if (!currentUser) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setAuthView('auth')}
          onExploreDemo={() => setAuthView('auth')}
          calendarRange={[getCurrentCalendarYear(), getCurrentCalendarYear() + 1, getCurrentCalendarYear() + 2, getCurrentCalendarYear() + 3]}
        />
      );
    }
    return (
      <AuthPage
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentTab('dashboard');
        }}
        onExploreDemo={() => setAuthView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c16] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Desktop Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        user={currentUser}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
        reminderConfig={reminderConfig}
        calendarRange={calendarRange}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              user={currentUser}
              onLogout={handleLogout}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(prev => !prev)}
              reminderConfig={reminderConfig}
              calendarRange={calendarRange}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenTodayModal={handleOpenTodayModal}
          hasTodayEntry={hasTodayEntry}
          reminderConfig={reminderConfig}
          onNavigateToReminders={() => setCurrentTab('reminders')}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(prev => !prev)}
        />

        {/* Tab Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              user={currentUser}
              stats={stats}
              entries={entries}
              calendarYears={calendarRange}
              reminderConfig={reminderConfig}
              hasTodayEntry={hasTodayEntry}
              onOpenTodayModal={handleOpenTodayModal}
              onSelectDate={handleOpenDayModal}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'calendar' && (
            <FourYearCalendar
              calendarYears={calendarRange}
              entries={entries}
              onSaveEntry={handleSaveEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          )}

          {currentTab === 'analytics' && (
            <div className="space-y-6">
              <ProgressCharts
                entries={entries}
                calendarYears={calendarRange}
              />
            </div>
          )}

          {currentTab === 'reports' && (
            <ReportsView
              entries={entries}
              calendarYears={calendarRange}
            />
          )}

          {currentTab === 'reminders' && (
            <ReminderCenter
              config={reminderConfig}
              onUpdateConfig={handleUpdateReminderConfig}
              hasTodayEntry={hasTodayEntry}
              onOpenTodayModal={handleOpenTodayModal}
              onTriggerAlarmTest={() => {
                startAlarmLoop(reminderConfig.ringtone || 'classic_alarm', reminderConfig.volume ?? 0.9);
                setIsAlarmModalOpen(true);
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              user={currentUser}
              onUpdateUser={handleUpdateUser}
              reminderConfig={reminderConfig}
              onUpdateReminder={handleUpdateReminderConfig}
              entriesCount={entries.length}
            />
          )}
        </main>
      </div>

      {/* Global Day Modal (opens for clicked date or today) */}
      <DayModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        dateStr={activeModalDate}
        existingEntry={entriesDateMap.get(activeModalDate)}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        calendarYears={calendarRange}
      />

      {/* Global In-App Alarm Modal (rings continuously until user stops/dismisses/snoozes) */}
      <InAppAlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => {
          stopAlarmLoop();
          setIsAlarmModalOpen(false);
        }}
        config={reminderConfig}
        hasTodayEntry={hasTodayEntry}
        onOpenTodayModal={handleOpenTodayModal}
        onSnooze={(minutes) => {
          stopAlarmLoop();
          const snoozed = reminderService.snooze(reminderConfig, minutes);
          setReminderConfig(snoozed);
          setIsAlarmModalOpen(false);
        }}
        onDismissToday={() => {
          stopAlarmLoop();
          const dismissed = reminderService.dismissForToday(reminderConfig);
          setReminderConfig(dismissed);
          setIsAlarmModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;
