-- =========================================================================
-- Study Tracker Database Schema (PostgreSQL for Supabase)
-- =========================================================================

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  login_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  calendar_start_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  target_daily_hours NUMERIC(3, 1) DEFAULT 4.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Study Entries Table
CREATE TABLE IF NOT EXISTS public.study_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  hours NUMERIC(4, 1) NOT NULL CHECK (hours >= 1 AND hours <= 15),
  subject TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_date_study_entry UNIQUE (user_id, date)
);

-- Enable RLS on study_entries
ALTER TABLE public.study_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study entries"
  ON public.study_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study entries"
  ON public.study_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study entries"
  ON public.study_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study entries"
  ON public.study_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_study_entries_user_date ON public.study_entries(user_id, date DESC);

-- 3. Reminder Settings Table
CREATE TABLE IF NOT EXISTS public.reminder_settings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  enabled BOOLEAN DEFAULT TRUE,
  time VARCHAR(10) DEFAULT '22:30',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  sound_enabled BOOLEAN DEFAULT TRUE,
  browser_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  custom_message TEXT DEFAULT 'Time to log your daily study hours before sleeping! Stay consistent with your goals.',
  snoozed_until TIMESTAMPTZ,
  last_triggered_date VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on reminder_settings
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminder settings"
  ON public.reminder_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own reminder settings"
  ON public.reminder_settings FOR ALL
  USING (auth.uid() = user_id);

-- 4. Reminder Delivery / Occurrence Logs
CREATE TABLE IF NOT EXISTS public.reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_date VARCHAR(10) NOT NULL,
  scheduled_time VARCHAR(10) NOT NULL,
  channel VARCHAR(20) NOT NULL, -- 'browser', 'in_app', 'email'
  status VARCHAR(20) NOT NULL,  -- 'delivered', 'snoozed', 'dismissed', 'study_already_completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on reminder_logs
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reminder logs"
  ON public.reminder_logs FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_date ON public.reminder_logs(user_id, scheduled_date);

-- Trigger to create profile upon new Supabase user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, login_year, calendar_start_year)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    COALESCE((NEW.raw_user_meta_data->>'login_year')::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER),
    COALESCE((NEW.raw_user_meta_data->>'calendar_start_year')::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER)
  );

  INSERT INTO public.reminder_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
