import React, { useState } from 'react';
import { StudyEntry } from '../../types';
import { MonthDetailed } from './MonthDetailed';
import { YearOverview } from './YearOverview';
import { DayModal } from './DayModal';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, ListFilter } from 'lucide-react';
import { getFestivalsForYear } from '../../services/festivalData';

interface FourYearCalendarProps {
  calendarYears: number[]; // e.g. [2026, 2027, 2028, 2029]
  entries: StudyEntry[];
  onSaveEntry: (date: string, hours: number, subject?: string, notes?: string) => Promise<void>;
  onDeleteEntry: (date: string) => Promise<void>;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const FourYearCalendar: React.FC<FourYearCalendarProps> = ({
  calendarYears,
  entries,
  onSaveEntry,
  onDeleteEntry,
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Selected year within the 4-year range
  const initialYear = calendarYears.includes(currentYear) ? currentYear : calendarYears[0];
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [viewMode, setViewMode] = useState<'detailed' | 'overview'>('detailed');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>('');

  // Map of date string -> StudyEntry for fast O(1) lookups
  const entriesMap = React.useMemo(() => {
    const map = new Map<string, StudyEntry>();
    entries.forEach(e => map.set(e.date, e));
    return map;
  }, [entries]);

  const handleSelectDate = (dStr: string) => {
    setModalDate(dStr);
    setModalOpen(true);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      const yearIdx = calendarYears.indexOf(selectedYear);
      if (yearIdx > 0) {
        setSelectedYear(calendarYears[yearIdx - 1]);
        setSelectedMonth(11);
      }
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      const yearIdx = calendarYears.indexOf(selectedYear);
      if (yearIdx < calendarYears.length - 1) {
        setSelectedYear(calendarYears[yearIdx + 1]);
        setSelectedMonth(0);
      }
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    if (calendarYears.includes(currentYear)) {
      setSelectedYear(currentYear);
      setSelectedMonth(currentMonth);
      setViewMode('detailed');
    }
  };

  const festivalsThisYear = getFestivalsForYear(selectedYear);

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Range Display */}
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Four-Year Study Calendar
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rolling 4-year academic cycle: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{calendarYears[0]} – {calendarYears[calendarYears.length - 1]}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 4 Years Segmented Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {calendarYears.map((yr, idx) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedYear === yr
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{yr}</span>
                <span className="hidden sm:inline opacity-70 ml-1 text-[10px] font-normal">
                  (Y{idx + 1})
                </span>
              </button>
            ))}
          </div>

          {/* View Mode & Today Jump */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleJumpToToday}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-xl transition"
            >
              Today
            </button>

            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  viewMode === 'detailed'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Detailed Month View"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Month</span>
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  viewMode === 'overview'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="12-Month Year Overview"
              >
                <ListFilter className="w-4 h-4" />
                <span className="hidden sm:inline">12 Months</span>
              </button>
            </div>
          </div>
        </div>

        {/* Month Navigation Row (if in detailed mode) */}
        {viewMode === 'detailed' && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-1.5 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m} {selectedYear}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {viewMode === 'detailed' ? (
        <MonthDetailed
          year={selectedYear}
          month={selectedMonth}
          entriesMap={entriesMap}
          onSelectDate={handleSelectDate}
        />
      ) : (
        <YearOverview
          year={selectedYear}
          entriesMap={entriesMap}
          onSelectDate={handleSelectDate}
          onSelectMonth={(m) => {
            setSelectedMonth(m);
            setViewMode('detailed');
          }}
        />
      )}

      {/* Calendar Color Legend & Annual Festival Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color Legend */}
        <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">Calendar Legend</span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600 ring-2 ring-indigo-400"></span> Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> Study Logged (1-15h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500"></span> Indian National Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400"></span> Major Indian Festival
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-300"></span> Weekend
            </span>
          </div>
        </div>

        {/* Verified Festivals Highlights */}
        <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Major Festivals & Holidays ({selectedYear})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
            {festivalsThisYear.map((f, i) => (
              <button
                key={i}
                onClick={() => handleSelectDate(f.date)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 hover:opacity-80 transition ${
                  f.category === 'national_holiday'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}
              >
                <span>{f.icon || '✨'}</span>
                <span>{f.name}</span>
                <span className="opacity-60 text-[9px]">({f.date.substring(5)})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Day Modal for Logging / Editing */}
      <DayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dateStr={modalDate}
        existingEntry={entriesMap.get(modalDate)}
        onSave={onSaveEntry}
        onDelete={onDeleteEntry}
        calendarYears={calendarYears}
      />
    </div>
  );
};
