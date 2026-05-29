# JHabits

A React Native habit tracker & planner with recursive goal tracking, stats, and calendar integration.

## Features

- **Habit Tracking** — Create, edit, check off daily habits
- **Recursive Goals** — Set daily, weekly, monthly, and yearly targets per habit
- **Statistics** — Progress rings, streak counters, bar charts, on-track projections
- **Calendar** — Monthly view with color-coded completion dots, day detail view
- **100% Offline** — All data stored locally via SQLite

## Tech Stack

- React Native (Expo SDK 56)
- TypeScript
- expo-sqlite (WAL mode, migrations)
- Zustand (state management)
- React Navigation 7
- react-native-calendars
- react-native-gifted-charts

## Getting Started

```bash
npm install
npm start
```

Scan QR with Expo Go, or run `npm run android`.

## Build APK

APK builds automatically on every push to `main` via GitHub Actions.

Manual: Go to **Actions** tab → **Build & Release Android APK** → **Run workflow**.

Beta releases trigger on pushes to the `beta` branch.

## Project Structure

```
src/
├── app/navigation/     # Tab + stack navigators
├── components/         # UI, habits, calendar, stats, tasks
├── screens/            # All app screens
├── db/                 # SQLite database + repositories
├── stores/             # Zustand state stores
├── services/           # Stats engine, streak calculator
├── types/              # TypeScript interfaces
├── utils/              # Date helpers, constants
└── theme/              # Colors, spacing, typography
```

## License

MIT
