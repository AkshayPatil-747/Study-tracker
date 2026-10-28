import React, { useState, useEffect } from 'react';
import { X, Clock, Trash2, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { StudyEntry, Festival } from '../../types';
import { getFestivalsForDate } from '../../services/festivalData';
import confetti from 'canvas-confetti';

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string; // YYYY-MM-DD
  existingEntry?: StudyEntry | null;
  onSave: (date: string, hours: number, subject?: string, notes?: string) => Promise<void>;
  onDelete: (date: string) => Promise<void>;
  calendarYears: number[];
}

export const DayModal: React.FC<DayModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  existingEntry,
  onSave,
  onDelete,
  calendarYears,
}) => {
  const [hours, setHours] = useState<number>(existingEntry?.hours || 3);
  const [subject, setSubject] = useState<string>(existingEntry?.subject || '');
  const [notes, setNotes] = useState<string>(existingEntry?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (existingEntry) {
      setHours(existingEntry.hours);
      setSubject(existingEntry.subject || '');
      setNotes(existingEntry.notes || '');
    } else {
      setHours(3);
      setSubject('');
      setNotes('');
    }
    setShowDeleteConfirm(false);
  }, [existingEntry, dateStr, isOpen]);

  if (!isOpen || !dateStr) return null;

  const dateObj = new Date(dateStr + 'T00:00:00');
  const year = dateObj.getFullYear();
  const isOutsideRange = !calendarYears.includes(year);

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const festivals: Festival[] = getFestivalsForDate(dateStr);
  const isToday = new Date().toDateString() === dateObj.toDateString();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hours < 1 || hours > 15) return;
    setIsSubmitting(true);
    try {
      await onSave(dateStr, hours, subject.trim(), notes.trim());
      // Celebration confetti if user logged >= 4 hours!
      if (hours >= 4) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(dateStr);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  {isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                {existingEntry && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Logged: {existingEntry.hours}h
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formattedDate}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Festival banner if applicable */}
          {festivals.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {festivals.map((fest, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium border"
                  style={{
                    backgroundColor: `${fest.color}15`,
                    borderColor: `${fest.color}40`,
                    color: fest.category === 'national_holiday' ? '#ef4444' : '#d97706',
                  }}
                >
                  <span className="text-base">{fest.icon || '✨'}</span>
                  <div>
                    <span className="font-semibold">{fest.name}</span>
                    <span className="opacity-80 ml-1.5 font-normal">({fest.description})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {isOutsideRange && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl text-xs">
              Note: This date is outside your registered 4-year calendar range ({calendarYears[0]} - {calendarYears[calendarYears.length - 1]}).
            </div>
          )}

          {/* Study Hours Picker */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" /> Study Duration
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-base">
                {hours} {hours === 1 ? 'Hour' : 'Hours'}
              </span>
            </label>

            {/* Quick Chips */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    hours === h
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>

            {/* Select Dropdown (1 to 15 hours) */}
            <div className="flex items-center gap-3">
              <select
                id="hours-select"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {h} {h === 1 ? 'hour' : 'hours'} {h >= 8 ? '🔥 Deep Work' : h >= 4 ? '⭐ Solid Focus' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject or Topic */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" /> Subject / Topic (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures, Quantum Physics, Calculus, AI"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={60}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Study Notes / Progress Details (Optional)
            </label>
            <textarea
              placeholder="What topics did you complete? Any key takeaways or milestones reached?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              maxLength={250}
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            {existingEntry ? (
              showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-500 font-medium">Confirm delete?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Entry
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {existingEntry ? 'Update Hours' : 'Save Hours'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
