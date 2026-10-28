import React from 'react';
import { FloatingStudyScene } from '../3d/FloatingStudyScene';
import { StudyUniverse3D } from '../3d/StudyUniverse3D';
import {
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Bell,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  GraduationCap,
  Library,
  Atom,
  Binary,
  Compass,
  FileText
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  calendarRange: number[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
  calendarRange,
}) => {
  const academicDisciplines = [
    { name: 'Computer Science & AI', icon: Binary, color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'Engineering & Math', icon: Compass, color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Physical & Natural Sciences', icon: Atom, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Medical & Life Sciences', icon: Award, color: 'text-rose-400 bg-rose-500/10' },
    { name: 'Humanities & Law', icon: Library, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Top Academic Notification Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-200">
        <span className="font-semibold flex items-center justify-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Four-Year Academic Calendar • Verified Indian Festivals • Bedtime Alarm with 5 High-Clarity Ringtones</span>
        </span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#070b14]/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-tight flex items-center gap-1.5">
                Study Tracker <GraduationCap className="w-4 h-4 text-indigo-400" />
              </span>
              <span className="text-[10px] text-indigo-400 font-bold block -mt-1 uppercase tracking-wider">
                Academic Journey {calendarRange[0]}–{calendarRange[calendarRange.length - 1]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreDemo}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition"
            >
              Sign In / Register
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 sm:pt-14 sm:pb-28 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Engineered for Academic Excellence & Discipline</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Your Goals. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                  Your Hours.
                </span> <br />
                Your Future.
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Build an unbreakable daily study habit. Seamlessly monitor your rolling 4-year degree timeline, explore verified Indian festivals, track 1 to 15 hours daily, and receive a persistent bedtime alarm before sleeping.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/35 flex items-center justify-center gap-2 transition transform active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Start Your Study Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onExploreDemo}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center justify-center gap-2 transition"
                >
                  <span>Student Sign In</span>
                </button>
              </div>

              {/* Badges / Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
                <div className="text-center lg:text-left">
                  <span className="text-xl sm:text-2xl font-black text-white block">
                    {calendarRange[0]}–{calendarRange[calendarRange.length - 1]}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Dynamic 4-Year Span</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-xl sm:text-2xl font-black text-indigo-400 block">1 to 15h</span>
                  <span className="text-[11px] text-slate-400 font-medium">Daily Study Logging</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 block">5 Ringtones</span>
                  <span className="text-[11px] text-slate-400 font-medium">Continuous Bedtime Alarm</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Educational Art Scene */}
            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-lg aspect-square relative">
                <FloatingStudyScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Disciplines Band */}
      <section className="py-6 border-y border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mr-2">
              Empowering Students Across:
            </span>
            {academicDisciplines.map((d, i) => {
              const Icon = d.icon;
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-semibold text-slate-300 ${d.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{d.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-extrabold flex items-center justify-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Scholastic Framework
            </h2>
            <h3 className="text-3xl font-black text-white">
              Built for Serious College Students
            </h3>
            <p className="text-slate-400 text-sm">
              From freshman year foundations to senior graduation — track every lecture, lab, and midnight revision session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Four-Year Rolling Calendar */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Dynamic 4-Year Academic Cycle</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Covers your login year through graduation ({calendarRange[0]} to {calendarRange[calendarRange.length - 1]}). Switch between month detailed views and full-year 12-month heatmaps.
              </p>
            </div>

            {/* 2. Indian Festivals & Holidays */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <span>🪔</span>
              </div>
              <h4 className="text-base font-bold text-white">Verified Indian Festivals</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diwali, Holi, Ganesh Chaturthi, Eid, Christmas, Republic Day, Independence Day, and more with verified lunar-calendar dates and cultural highlights.
              </p>
            </div>

            {/* 3. Daily 1-15h Study Tracking */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Daily Study Logging (1 to 15h)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any calendar date to record study duration, subjects, and key takeaways. Accidental duplicate entries are seamlessly prevented.
              </p>
            </div>

            {/* 4. Bedtime Alarm & Reminders */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Continuous Bedtime Alarm</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set a daily alarm before sleeping (e.g. 10:30 PM, 1:00 AM). Choose from 5 distinct ringtones that loop continuously until you stop or snooze them.
              </p>
            </div>

            {/* 5. Deep Analytics & Comparison */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Interactive Progress Graphs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Daily, weekly, monthly, and four-year side-by-side comparative graphs powered by Recharts with active streak counters and productivity rankings.
              </p>
            </div>

            {/* 6. Multi-User Privacy & Clean Start */}
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Private & Isolated Records</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean authentic start with zero dummy data injected. Secure multi-user database storage protected with PostgreSQL Row Level Security (RLS).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Universe Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#070b14] border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-lg space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> 4-Year Academic Universe
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Every Year Is An Orbit in Your Academic Galaxy
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Experience the visual journey of your college years from freshman initiation to graduation triumph. See your study momentum compound across consecutive semesters.
            </p>
            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
              >
                Launch Your Study Orbit
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm h-64 flex items-center justify-center">
            <StudyUniverse3D years={calendarRange} activeYear={calendarRange[0]} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>Study Tracker © {new Date().getFullYear()} – Four-Year Study Calendar & Progress Dashboard</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Designed for college students with verified Indian festivals, 5-ringtone continuous alarm, and 3D educational visualizations.
        </p>
      </footer>
    </div>
  );
};
