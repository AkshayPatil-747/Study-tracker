import React, { useState } from 'react';
import { authService, getCurrentCalendarYear } from '../../services/authService';
import { FloatingStudyScene } from '../3d/FloatingStudyScene';
import { User } from '../../types';
import { BookOpen, Sparkles, Lock, Mail, User as UserIcon, Calendar, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onSuccess: (user: User) => void;
  onExploreDemo?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onExploreDemo }) => {
  const currentYear = getCurrentCalendarYear();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [startYear, setStartYear] = useState<number>(currentYear);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await authService.login(email, password);
        if (res.error) {
          setError(res.error);
        } else if (res.user) {
          onSuccess(res.user);
        }
      } else if (mode === 'register') {
        const res = await authService.register(email, password, fullName, startYear);
        if (res.error) {
          setError(res.error);
        } else if (res.user) {
          onSuccess(res.user);
        }
      } else if (mode === 'forgot') {
        const res = await authService.forgotPassword(email);
        if (res.success) {
          setInfoMessage(res.message);
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    try {
      // Sign in as Demo Scholar
      const demoEmail = 'student@studytracker.edu';
      const demoPass = 'password123';
      let res = await authService.login(demoEmail, demoPass);
      if (!res.user) {
        // Register demo user
        res = await authService.register(demoEmail, demoPass, 'Akshay Sharma', currentYear);
      }
      if (res.user) {
        onSuccess(res.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Left side: 3D Educational Art Scene */}
      <div className="lg:w-1/2 min-h-[340px] lg:min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0b1329] p-8 flex flex-col justify-between">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight block">
              Study Tracker
            </span>
            <span className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase">
              Four-Year Academic Journey
            </span>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="relative z-10 my-auto py-4">
          <FloatingStudyScene />
          <div className="text-center px-4 -mt-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              “Your Goals. Your Hours. Your Future.”
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
              Build consistent daily study habits with an interactive four-year calendar, verified Indian festival tracker, and nightly alarm system.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-center lg:text-left text-xs text-slate-400">
          Rolling 4-year cycle starts from your login year • Private & isolated student records
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {mode === 'login' ? 'Student Portal' : mode === 'register' ? 'New Registration' : 'Account Recovery'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === 'login' && 'Sign in to Study Tracker'}
              {mode === 'register' && 'Create your study account'}
              {mode === 'forgot' && 'Reset your password'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login' && 'Enter your credentials to access your personal dashboard & calendar'}
              {mode === 'register' && 'Start tracking your 4-year academic cycle with personalized reminders'}
              {mode === 'forgot' && 'Enter your registered email address to receive reset instructions'}
            </p>
          </div>

          {/* Error / Info Alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Akshay Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError(null);
                        setInfoMessage(null);
                      }}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Calendar Starting Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs font-bold"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} (4-Year Range: {yr} to {yr + 3})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Your four-year calendar will dynamically cover {startYear}, {startYear + 1}, {startYear + 2}, and {startYear + 3}.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {isLoading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In to Dashboard'
                  : mode === 'register'
                  ? 'Create My Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Mode */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' && (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-2"
            >
              <span>⚡ One-Click Instant Demo Access (Pre-populated)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
