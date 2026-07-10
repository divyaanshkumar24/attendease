<div align="center">

<img src="public/icon.svg" width="80" height="80" alt="AttendEase logo" />

# AttendEase

**College attendance tracking, simplified.**

Track lectures, monitor attendance percentages, plan ahead with smart calendars — all in one clean app built for students.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Overview

AttendEase is a modern, mobile-first web application that helps students stay on top of their attendance. Define your semester, build your timetable once, and the app tracks every class automatically — including bunk planning, subject-wise analytics, and a visual monthly calendar.

---

## Features

| | Feature | Description |
|---|---|---|
| 📅 | **Today's Schedule** | See exactly which lectures are happening right now, with room numbers and timings |
| 🗓️ | **Smart Calendar** | Month view with colour-coded attendance status per day; tap any day to mark or edit |
| 📚 | **Subject Management** | Add subjects with custom colours, track bunks vs. attendance per subject |
| 🕐 | **Timetable Builder** | Visual weekly grid with room numbers; export the full timetable to PNG |
| 📊 | **Attendance Dashboard** | Overview cards showing overall %, safe-to-bunk counts, and risk alerts |
| 📈 | **Reports** | Deep per-subject breakdown with progress bars and attendance history |
| ✅ | **Task Tracker** | Built-in to-do list linked to your academic schedule |
| 🌙 | **Dark Mode** | Full dark theme throughout, synced to system preference |
| 🎓 | **Semester-aware** | All data is scoped to the active semester; switch or archive at any time |
| 📱 | **PWA Ready** | Installable on mobile — works like a native app |

---

## Screenshots

> Add screenshots to `docs/screenshots/` and they will render here automatically.

| Login | Today's Schedule | Calendar |
|:---:|:---:|:---:|
| ![Login](docs/screenshots/login.png) | ![Today](docs/screenshots/today.png) | ![Calendar](docs/screenshots/calendar.png) |

| Timetable | Subjects | Reports |
|:---:|:---:|:---:|
| ![Timetable](docs/screenshots/timetable.png) | ![Subjects](docs/screenshots/subjects.png) | ![Reports](docs/screenshots/reports.png) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) — App Router, Server Components, Route Handlers |
| **Language** | TypeScript 5 |
| **Database & Auth** | [Supabase](https://supabase.com) — PostgreSQL with Row Level Security |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) with custom CSS design tokens |
| **Caching** | [Upstash Redis](https://upstash.com) |
| **Dark Mode** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Timetable Export** | [html2canvas](https://html2canvas.hertzen.com) |
| **Deployment** | [Vercel](https://vercel.com) |
| **PWA** | Service Worker + Web App Manifest |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Upstash](https://upstash.com) Redis database (for caching)

### 1. Clone the repo

```bash
git clone https://github.com/divyaanshkumar24/attendease.git
cd attendease
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 4. Run the database migration

In the Supabase dashboard → **SQL Editor**, run the contents of [`supabase/migration.sql`](supabase/migration.sql). This creates all tables and RLS policies.

### 5. Add users

There is no public signup. Users are added directly in the Supabase dashboard:
**Authentication → Users → Invite user**

### 6. Start the dev server

```bash
npm run dev
# Open http://localhost:3001
```

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.local` in the Vercel project settings.
4. Deploy.

In your Supabase project go to **Authentication → URL Configuration** and add your Vercel deployment URL to **Site URL** and **Redirect URLs** (e.g. `https://your-app.vercel.app`).

---

## Database Schema

| Table | Purpose |
|---|---|
| `semesters` | Academic periods with start/end dates and active flag |
| `subjects` | Per-semester subjects with colour assignments and attendance targets |
| `timetable_slots` | Weekly recurring class schedule with room numbers |
| `special_days` | Holidays, no-college days, and extra working days |
| `extra_lectures` | One-off lectures outside the regular timetable |
| `attendance_records` | Per-slot attendance — attended / missed / cancelled |
| `todos` | Task items scoped to the user |

All tables have RLS enabled — users can only access their own rows.

---

## Project Structure

```
attendease/
├── app/
│   ├── auth/               # Auth callback + signout handlers
│   ├── dashboard/
│   │   ├── layout.tsx      # Sidebar + auth guard
│   │   ├── today/          # Today's lecture schedule
│   │   ├── calendar/       # Monthly attendance calendar
│   │   ├── overview/       # Attendance dashboard
│   │   ├── subjects/       # Subject management
│   │   ├── timetable/      # Weekly timetable builder
│   │   ├── todos/          # Task tracker
│   │   ├── reports/        # Per-subject reports
│   │   └── settings/       # Semester + account settings
│   ├── login/              # Login page
│   └── onboarding/         # First-time semester setup
├── components/
│   ├── ui/                 # Button, Card, Modal, Input, Badge…
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── attendance.ts       # Core attendance calculation logic
│   ├── supabase.ts         # Browser Supabase client
│   ├── supabase-server.ts  # Server Supabase client
│   ├── types.ts
│   └── utils.ts            # Subject colours, helpers
├── middleware.ts            # Route protection
└── supabase/
    └── migration.sql       # Full schema + RLS policies
```

---

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please keep PRs focused — one feature or fix per PR.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## Authors

Built with ♥ by

**Divyaansh Kumar** · [@divyaanshkumar24](https://github.com/divyaanshkumar24)

**Ayush Mangela**

---

<div align="center">
<sub>AttendEase — because missing 75% attendance shouldn't sneak up on you.</sub>
</div>
