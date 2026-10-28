import React from 'react';
import { StudyEntry } from '../../types';
import { getFestivalsForDate } from '../../services/festivalData';
import { getLocalDateString } from '../../services/studyService';

interface YearOverviewProps {
  year: number;
  entriesMap: Map<string, StudyEntry>;
  onSelectDate: (dateStr: string) => void;
  onSelectMonth: (monthIndex: number) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const YearOverview: React.FC<YearOverviewProps> = ({
  year,
  entriesMap,
  onSelectDate,
  onSelectMonth,
}) => {
  const todayStr = getLocalDateString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {MONTH_NAMES.map((mName, mIdx) => {
        const firstDay = new Date(year, mIdx, 1);
        const lastDay = new Date(year, mIdx + 1, 0);
        const totalDays = lastDay.getDate();
        const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Mon=0

        // Calculate total hours for this month
        let monthTotalHours = 0;
        let loggedDaysCount = 0;
        const prefix = `${year}-${String(mIdx + 1).padStart(2, '0')}`;
        for (let d = 1; d <= totalDays; d++) {
          const dStr = `${prefix}-${String(d).padStart(2, '0')}`;
          const entry = entriesMap.get(dStr);
          if (entry) {
            monthTotalHours += entry.hours;
            loggedDaysCount++;
          }
        }

        return (
          <div
            key={mName}
            className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm hover:shadow-md transition-all group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => onSelectMonth(mIdx)}
                className="text-left font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-1.5 transition"
              >
                <span>{mName}</span>
                <span className="text-[11px] font-normal text-slate-400 group-hover:translate-x-0.5 transition">→</span>
              </button>
              <div className="text-right">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {monthTotalHours}h
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {loggedDaysCount} {loggedDaysCount === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>

            {/* Mini weekday labels */}
            <div className="grid grid-cols-7 gap-1 text-[9px] font-semibold text-center text-slate-400 mb-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span className="text-amber-500">S</span><span className="text-amber-500">S</span>
            </div>

            {/* Mini Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty leading padding */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="w-full aspect-square" />
              ))}

              {/* Month Days */}
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
                const dateStr = `${prefix}-${String(d).padStart(2, '0')}`;
                const entry = entriesMap.get(dateStr);
                const festivals = getFestivalsForDate(dateStr);
                const isToday = dateStr === todayStr;
                const hasHoliday = festivals.some(f => f.category === 'national_holiday');
                const hasFestival = festivals.length > 0;

                let bgClass = 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700';

                if (entry) {
                  if (entry.hours >= 8) {
                    bgClass = 'bg-emerald-600 text-white font-bold shadow-xs';
                  } else if (entry.hours >= 4) {
                    bgClass = 'bg-emerald-400 text-emerald-950 font-bold';
                  } else {
                    bgClass = 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100';
                  }
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => onSelectDate(dateStr)}
                    title={`${dateStr}: ${entry ? `${entry.hours}h logged` : 'No study logged'}${
                      festivals.length > 0 ? ` (${festivals.map(f => f.name).join(', ')})` : ''
                    }`}
                    className={`aspect-square w-full rounded-md text-[10px] font-medium flex items-center justify-center relative transition-all duration-150 ${bgClass} ${
                      isToday ? 'ring-2 ring-indigo-500 font-bold' : ''
                    }`}
                  >
                    <span>{d}</span>
                    {/* Festival indicator dot */}
                    {hasFestival && !entry && (
                      <span
                        className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                          hasHoliday ? 'bg-rose-500' : 'bg-amber-400'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
