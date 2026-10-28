import React from 'react';
import { StudyEntry } from '../../types';
import { getFestivalsForDate } from '../../services/festivalData';
import { BookOpen, Calendar, Edit3, Sparkles } from 'lucide-react';

interface RecentActivityProps {
  entries: StudyEntry[];
  onSelectDate: (dateStr: string) => void;
  onOpenTodayModal: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  entries,
  onSelectDate,
  onOpenTodayModal,
}) => {
  const recentEntries = entries.slice(0, 6);

  return (
    <div className="glass-panel p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Recent Study Activity
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Your most recently recorded study sessions
          </p>
        </div>

        <button
          onClick={onOpenTodayModal}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" /> Log Session
        </button>
      </div>

      {recentEntries.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-xs">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-400" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">No study sessions logged yet</p>
          <p className="text-[11px] mt-0.5">Click any date in the calendar or tap "Log Session" to start tracking!</p>
          <button
            onClick={onOpenTodayModal}
            className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow-sm hover:bg-indigo-700 transition"
          >
            Log Today's Hours
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {recentEntries.map((entry) => {
            const dateObj = new Date(entry.date + 'T00:00:00');
            const festivals = getFestivalsForDate(entry.date);
            const dateDisplay = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              weekday: 'short',
            });

            return (
              <div
                key={entry.id}
                onClick={() => onSelectDate(entry.date)}
                className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {dateDisplay}
                    </span>
                    {festivals.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-semibold truncate max-w-[120px]">
                        {festivals[0].name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {entry.subject ? `📚 ${entry.subject}` : 'General Study Session'}
                    {entry.notes ? ` • "${entry.notes}"` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {entry.hours}h
                  </span>
                  <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
