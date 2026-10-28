# 🎓 Study Tracker – Four-Year Study Calendar & Progress Dashboard

> **“Your Goals. Your Hours. Your Future.”**  
> A modern, futuristic student productivity platform engineered to help college students build rock-solid study habits, visualize a rolling four-year academic journey, celebrate Indian festivals, analyze progress with interactive charts, and stay on track with nightly bedtime study alarms.

---

## 🌟 Key Highlights & Features

### 1. 🔐 User Authentication & Private Records
- **Separate Accounts & Isolation:** Each user has isolated accounts and private records secured via PostgreSQL Row Level Security (RLS) on Supabase or an offline-ready persistent storage layer.
- **Dynamic 4-Year Academic Range:** Determines user's login year (e.g. 2026 or 2027) upon authentication and dynamically calculates exactly four consecutive academic years (e.g., **2026, 2027, 2028, and 2029** or **2027, 2028, 2029, and 2030**).
- **Split-Screen Authentication:** Modern split-screen layout featuring a live 3D educational Three.js scene (floating books, graduation cap, glowing particles) on one side and an authentication form on the other. Includes login, registration, and forgot-password flows.
- **One-Click Demo Access:** Instant demo login with pre-populated study data across months and years.

### 2. 📅 Interactive Four-Year Indian Festival Calendar
- **Dynamic 4-Year Span:** Displays all 12 months for every year in the student's 4-year horizon.
- **Two Flexible Views:**
  - **Detailed Monthly View:** Large interactive calendar grid with weekday headers, weekend accents, today's glowing ring, festival tags, and study hour badges.
  - **12-Month Year Overview:** Mini heat-map grid showing intensity of study hours, festival dots, and monthly hour totals with one-click month jump.
- **Verified Indian Festivals & National Holidays:**
  - **Indian National Holidays:** Republic Day (Jan 26), Independence Day (Aug 15), Mahatma Gandhi Jayanti (Oct 2).
  - **Major Festivals (Verified Lunar/Solar Dates):** Diwali, Holi, Ganesh Chaturthi, Raksha Bandhan, Navratri, Dussehra, Eid ul-Fitr, Eid al-Adha, Christmas, Makar Sankranti/Pongal, Maha Shivratri, Krishna Janmashtami, Ram Navami, Guru Nanak Jayanti, Karwa Chauth, and Bhai Dooj.
  - Distinctive visual styling and cultural descriptions for every festival.
- **Click to Track:** Clicking any date immediately opens the daily study-hour tracking panel.

### 3. ⏱️ Daily Study-Hour Tracking (1 to 15 Hours)
- **Log Hours:** Quick selection chips (`1h`, `2h`, `3h`, `4h`, `5h`, `6h`, `8h`, `10h`, `12h`, `15h`) and custom dropdown from 1 to 15 hours.
- **Subject & Notes:** Record course topics (e.g., *Data Structures*, *Calculus*, *Operating Systems*) and study takeaways.
- **Accidental Duplicate Prevention:** Automatically updates existing entries for the same user and date rather than creating duplicate entries.
- **CRUD Operations:** Easily Save, Edit/Update, and Delete entries with instant recalculation of all metrics.
- **Milestone Confetti:** Triggers celebration confetti whenever a user logs $\ge 4$ hours of deep focus!

### 4. ⏰ Daily Bedtime Alarm & Reminder System
- **Intelligent Recurring Alarm:** Configurable daily alarm scheduled before sleeping (e.g. `10:30 PM`, `11:45 PM`, or late-night times such as `1:00 AM`, `2:00 AM`).
- **Timezone Aware:** Uses the user's detected local timezone (e.g. `Asia/Kolkata`) and recalculates dynamically.
- **Browser Push Notifications:** Native browser desktop/mobile notifications with permission requesting, state management, and test actions.
- **In-App Alarm Modal:** When user is browsing the website, shows an in-app glassmorphic alarm card with a soft harmonic chime (Web Audio API).
- **Status Integration:**
  - If today's hours are already recorded: greets user with a completion badge and allows dismissing for tonight.
  - If today's hours are missing: prominent CTA button *"Log Today's Study Hours Now"* that opens today's entry form immediately.
- **Snooze Functionality:** Easily snooze for **10 minutes**, **30 minutes**, or **1 hour**.
- **Duplicate Prevention:** Prevents repeated alerts for the same user, date, and occurrence.
- **Fallback Notice:** Clearly notes browser push behavior when device is closed and provides in-app fallback alerts on next visit.

### 5. 📊 Data Visualizations & Comparative Analytics
Powered by **Recharts**:
- **Daily Progress Graph:** Bar chart tracking daily study hours over recent weeks.
- **Weekly Progress Graph:** Monday–Sunday distribution of study hours for the current week.
- **Monthly Progress Graph:** 12-month study curve across the selected year with monthly totals and daily averages.
- **Four-Year Comparative Graph:** Side-by-side comparison of all 4 years in the student's dynamic cycle.
- **Summary Cards:** Total hours, today's hours, weekly total, monthly total, daily average, current streak (with animated flame 🔥), and longest streak.
- **Weekly & Monthly Reports:** Comparative analysis against previous periods ($+ / - \text{hours}$ and $\text{progress}\%$) and unlocked achievement badges.

### 6. 🎨 3D Educational Visuals (Three.js)
- **Floating Study Scene:** 3D hardcover books with page details, gold spine stripes, mortarboard graduation cap with tassel, glowing star particles, and interactive mouse parallax.
- **Four-Year Study Universe:** Rotating 3D academic globe with orbital rings and satellite markers for each of the 4 years.
- **3D Study Hourglass:** Brass-capped hourglass with flowing gold sand particles in the Reminders section.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, Glassmorphism CSS, Lucide React
- **3D Graphics:** Three.js (Optimized WebGL canvases with reduced-motion support)
- **Data Charts:** Recharts
- **Celebration Effects:** Canvas Confetti
- **Audio:** Web Audio API (Synthesized harmonic chime)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) + Local Offline Resilient Storage Fallback

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Clone & Install
```bash
# Navigate to the project root
cd "Study Tracker"

# Install dependencies
npm install
```

### 2. Configure Environment Variables (Optional)
The application works immediately out-of-the-box with local encrypted storage. To connect to your Supabase PostgreSQL backend:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Run the SQL schema script provided in `supabase_schema.sql` in your Supabase SQL Editor.

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Production build artifacts will be generated in `dist/`.

---

## 🗄️ Database Architecture (`supabase_schema.sql`)

The database schema is defined in [supabase_schema.sql](file:///c:/Users/aksha/OneDrive/Desktop/Study%20Tracker/supabase_schema.sql) with the following structure:

1. **`profiles`**:
   - `id`: UUID (Primary Key referencing `auth.users(id)`)
   - `full_name`: Text
   - `login_year`: Integer (e.g. 2026, 2027)
   - `calendar_start_year`: Integer (determines 4-year cycle)
   - `target_daily_hours`: Numeric
   - RLS Policies: `Users can only view, insert, and update their own profile`.

2. **`study_entries`**:
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (References `auth.users(id)`)
   - `date`: Date (YYYY-MM-DD)
   - `hours`: Numeric (1 to 15 hours check constraint)
   - `subject`: Text
   - `notes`: Text
   - `CONSTRAINT unique_user_date_study_entry UNIQUE (user_id, date)`: Prevents duplicate entries.
   - RLS Policies: `Users can select, insert, update, and delete only their own entries`.

3. **`reminder_settings`**:
   - `user_id`: UUID (Primary Key referencing `auth.users(id)`)
   - `enabled`: Boolean
   - `time`: Text (e.g. `22:30` or `01:30`)
   - `timezone`: Text (e.g. `Asia/Kolkata`)
   - `sound_enabled`: Boolean
   - `browser_notifications`: Boolean
   - `custom_message`: Text
   - `snoozed_until`: Timestamp
   - `last_triggered_date`: Text (YYYY-MM-DD)
   - RLS Policies: Full isolation per user.

4. **`reminder_logs`**:
   - Records notification delivery occurrences and prevents duplicate alerts.

---

## 🔔 Reminder & Notification Architecture

- **Browser Notification API:** Native browser alerts trigger when permission is granted.
- **In-App Alarm Modal:** Triggers when the user is actively studying on the platform.
- **Audio Chime:** Gentle 3-note harmonic chime generated in real-time via Web Audio API. Can be toggled on/off in Settings.
- **Browser Limitations:** Pure browser notifications require the browser process to be active. If the device was powered down, an in-app banner notifies the student upon their next visit to log any missed study sessions.

---

## 📄 License
MIT © Study Tracker
