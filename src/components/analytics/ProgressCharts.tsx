import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { StudyEntry } from '../../types';
import { BookOpen, Calendar, Info } from 'lucide-react';

interface ProgressChartsProps {
  entries: StudyEntry[];
  calendarYears: number[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ entries, calendarYears }) => {
  const [chartTab, setChartTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'fourYear'>('daily');
  const [selectedYear, setSelectedYear] = useState<number>(calendarYears[0]);

  // Date map
  const dateMap = useMemo(() => {
    const map = new Map<string, StudyEntry>();
    entries.forEach(e => map.set(e.date, e));
    return map;
  }, [entries]);

  const hasAnyEntries = entries.length > 0;

  // 1. Daily Data (Last 14 days)
  const dailyData = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dStr = `${y}-${m}-${day}`;

      const entry = dateMap.get(dStr);
      result.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        fullDate: dStr,
        hours: entry ? entry.hours : 0,
        subject: entry?.subject || 'None',
      });
    }
    return result;
  }, [dateMap]);

  // 2. Weekly Data (Current Week Mon-Sun)
  const weeklyData = useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Mon = 0
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((dayName, idx) => {
      const cur = new Date(monday);
      cur.setDate(monday.getDate() + idx);
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      const dStr = `${y}-${m}-${d}`;

      const entry = dateMap.get(dStr);
      return {
        day: dayName,
        date: `${cur.getMonth() + 1}/${cur.getDate()}`,
        hours: entry ? entry.hours : 0,
        subject: entry?.subject || '',
      };
    });
  }, [dateMap]);

  // 3. Monthly Data (All 12 months for selected year)
  const yearlyMonthsData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((mName, mIdx) => {
      const prefix = `${selectedYear}-${String(mIdx + 1).padStart(2, '0')}`;
      let totalHours = 0;
      let daysLogged = 0;

      entries.forEach(e => {
        if (e.date.startsWith(prefix)) {
          totalHours += e.hours;
          daysLogged++;
        }
      });

      return {
        month: mName,
        hours: totalHours,
        daysLogged,
        average: daysLogged > 0 ? Number((totalHours / daysLogged).toFixed(1)) : 0,
      };
    });
  }, [entries, selectedYear]);

  // 4. Four-Year Overview Comparison
  const fourYearData = useMemo(() => {
    return calendarYears.map((yr, idx) => {
      const yrPrefix = `${yr}-`;
      let totalHours = 0;
      let daysCount = 0;

      entries.forEach(e => {
        if (e.date.startsWith(yrPrefix)) {
          totalHours += e.hours;
          daysCount++;
        }
      });

      return {
        year: `Year ${idx + 1} (${yr})`,
        hours: totalHours,
        daysCount,
        averageHours: daysCount > 0 ? Number((totalHours / daysCount).toFixed(1)) : 0,
      };
    });
  }, [entries, calendarYears]);

  return (
    <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm space-y-5">
      {/* Chart Selector Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {[
            { id: 'daily', label: 'Daily (Last 14 Days)' },
            { id: 'weekly', label: 'Weekly (Current Week)' },
            { id: 'monthly', label: 'Monthly (Yearly Curve)' },
            { id: 'fourYear', label: '4-Year Comparison' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setChartTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {chartTab === 'monthly' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Academic Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-2.5 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              {calendarYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Notice if no hours logged yet */}
      {!hasAnyEntries && (
        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/50 rounded-xl flex items-center gap-2.5 text-xs text-indigo-800 dark:text-indigo-300">
          <Info className="w-4 h-4 flex-shrink-0 text-indigo-500" />
          <span>
            You have not logged any study sessions yet. Your progress bars will automatically appear as you log hours.
          </span>
        </div>
      )}

      {/* Graphs render */}
      <div className="h-72 w-full pt-2">
        {chartTab === 'daily' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 15]} tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                        <p className="font-bold">{data.fullDate}</p>
                        <p className="text-emerald-400 font-semibold">{data.hours} hours logged</p>
                        {data.subject && data.subject !== 'None' && (
                          <p className="text-slate-300">Topic: {data.subject}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} name="Study Hours" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartTab === 'weekly' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 15]} tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                        <p className="font-bold">{data.day} ({data.date})</p>
                        <p className="text-emerald-400 font-semibold">{data.hours} hours logged</p>
                        {data.subject && <p className="text-slate-300">{data.subject}</p>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="hours" fill="#10b981" radius={[6, 6, 0, 0]} name="Study Hours" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartTab === 'monthly' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyMonthsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                        <p className="font-bold">{data.month} {selectedYear}</p>
                        <p className="text-indigo-400 font-semibold">Total: {data.hours} hours</p>
                        <p className="text-slate-300">Days Logged: {data.daysLogged}</p>
                        <p className="text-slate-300">Daily Avg: {data.average} hrs/day</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1' }}
                activeDot={{ r: 6 }}
                name="Total Study Hours"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f59e0b' }}
                name="Daily Average (hrs)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartTab === 'fourYear' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fourYearData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                        <p className="font-bold">{data.year}</p>
                        <p className="text-emerald-400 font-semibold">{data.hours} Total Hours</p>
                        <p className="text-slate-300">{data.daysCount} Study Days</p>
                        <p className="text-indigo-300">Daily Average: {data.averageHours}h</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Total Hours" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
