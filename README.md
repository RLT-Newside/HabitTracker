# JHabits

Habit Tracker & Planner PWA with Android APK support via Capacitor.

## Features

- **Habit Tracking** — Create, edit, check off daily habits
- **Recursive Goals** — Set daily, weekly, monthly, and yearly targets per habit
- **Statistics** — Progress rings, streak counters, on-track projections
- **Calendar** — Monthly view with color-coded completion dots
- **100% Offline** — All data stored in localStorage, no accounts
- **PWA** — Installable on any device via browser
- **Android APK** — Native app via Capacitor

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Capacitor 8 (Android bridge)
- localStorage (via useStorage hook)
- lucide-react (icons)

## Getting Started

```bash
npm install
npm run dev
```

## Build APK

APK builds automatically on every push to `main` via GitHub Actions.

Requires secrets: `KEYSTORE_BASE64`, `KEY_ALIAS`, `KEYSTORE_PASSWORD`

Beta releases on the `beta` branch.

## Project Structure

```
src/
├── components/
│   ├── layout/        # Header, BottomNav
│   ├── dashboard/     # Dashboard view
│   ├── habits/        # HabitForm
│   ├── calendar/      # CalendarView
│   ├── stats/         # StatsView
│   ├── settings/      # SettingsModal
│   └── shared/        # ProgressRing, Modal
├── hooks/             # useStorage, useTheme, useStats, useUpdateCheck
├── types/             # TypeScript interfaces
└── App.tsx            # Main app, state management via hooks
```

## License

MIT
