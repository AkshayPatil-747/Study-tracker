import React from 'react';
import { StudyEntry } from '../../types';
import { getFestivalsForDate } from '../../services/festivalData';
import { getLocalDateString } from '../../services/studyService';
import { Check, Flame } from 'lucide-react';

interface MonthDetailedProps {
  year: number;
  month: number; // 0 to 11
  entriesMap: Map<string, StudyEntry>;
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthDetailed: React.FC<MonthDetailedProps> = ({
  year,
  month,
  entriesMap,
  onSelectDate,
}) => {
  const todayStr = getLocalDateString();

  // First day of month
  const firstDay = new Date(year, month, 1);
  // Last day of month
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // Day of week of 1st day (0 is Sun, 1 is Mon... in JS getDay())
  // We want Mon = 0, Sun = 6
  let startingDayOfWeek = (firstDay.getDay() + 6) % 7;

  // Previous month trailing days to pad
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days: {
    dateStr: string;
    dayNum: number;
    isCurrentMonth: boolean;
    isWeekend: boolean;
  }[] = [];

  // Pad previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dNum = prevMonthLastDay - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    const dStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
    const dayOfWeek = (new Date(prevY, prevM, dNum).getDay() + 6) % 7;
    days.push({
      dateStr: dStr,
      dayNum: dNum,
      isCurrentMonth: false,
      isWeekend: dayOfWeek >= 5,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = (new Date(year, month, d).getDay() + 6) % 7;
    days.push({
      dateStr: dStr,
      dayNum: d,
      isCurrentMonth: true,
      isWeekend: dayOfWeek >= 5,
    });
  }

  // Pad next month days to complete grid (multiples of 7)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    const dStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
    const dayOfWeek = (new Date(nextY, nextM, n).getDay() + 6) % 7;
    days.push({
      dateStr: dStr,
      dayNum: n,
      isCurrentMonth: false,
      isWeekend: dayOfWeek >= 5,
    });
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-6 shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
        {WEEKDAYS.map((day, idx) => (
          <div
            key={day}
            className={`py-2 rounded-lg ${
              idx >= 5
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                : 'bg-slate-100/60 dark:bg-slate-800/50'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {days.map((item) => {
          const entry = entriesMap.get(item.dateStr);
          const festivals = getFestivalsForDate(item.dateStr);
          const isToday = item.dateStr === todayStr;
          const hasHoliday = festivals.some(f => f.category === 'national_holiday');
          const hasFestival = festivals.length > 0;

          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={`min-h-[78px] sm:min-h-[96px] p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition-all duration-200 relative group select-none ${
                !item.isCurrentMonth
                  ? 'opacity-35 bg-slate-50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800'
                  : isToday
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 shadow-md'
                  : item.isWeekend
                  ? 'bg-amber-50/25 dark:bg-amber-950/10 border-amber-200/40 dark:border-amber-900/30 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow'
              }`}
            >
              {/* Day Number & Today indicator */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs sm:text-sm font-semibold rounded-md px-1.5 py-0.5 ${
                    isToday
                      ? 'bg-indigo-600 text-white font-bold'
                      : hasHoliday
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : item.isWeekend
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.dayNum}
                </span>

                {/* Study badge if logged */}
                {entry && (
                  <span
                    className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm ${
                      entry.hours >= 8
                        ? 'bg-emerald-600 text-white'
                        : entry.hours >= 4
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    {entry.hours >= 8 && <Flame className="w-2.5 h-2.5" />}
                    {entry.hours}h
                  </span>
                )}
              </div>

              {/* Festival / Holiday tags */}
              <div className="mt-1 space-y-0.5 overflow-hidden w-full">
                {festivals.slice(0, 2).map((fest, idx) => (
                  <div
                    key={idx}
                    className={`truncate text-[9px] sm:text-[10px] font-semibold px-1 py-0.5 rounded flex items-center gap-1 ${
                      fest.category === 'national_holiday'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                    }`}
                    title={`${fest.name}: ${fest.description}`}
                  >
                    <span>{fest.icon || '✨'}</span>
                    <span className="truncate">{fest.name}</span>
                  </div>
                ))}

                {/* Subject tag if saved */}
                {entry?.subject && (
                  <div className="hidden sm:block truncate text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    📚 {entry.subject}
                  </div>
                )}
              </div>

              {/* Status indicator footer */}
              <div className="w-full flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                {isToday && (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    TODAY
                  </span>
                )}
                {entry && !isToday && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Logged
                  </span>
                )}
                {!entry && item.isCurrentMonth && !isToday && (
                  <span className="opacity-0 group-hover:opacity-100 text-slate-400 text-[10px] transition">
                    + Log
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
