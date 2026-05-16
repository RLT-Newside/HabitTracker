export const PALETTE = {
  bg: "#0a0a0f",
  surface: "#13131a",
  card: "#1a1a26",
  border: "#2a2a3e",
  accent: "#6c63ff",
  accentSoft: "#6c63ff22",
  gold: "#ffd700",
  green: "#22d3a5",
  red: "#ff4d6d",
  orange: "#ff9a3c",
  blue: "#38bdf8",
  text: "#e8e8f0",
  muted: "#7a7a9d",
  white: "#ffffff",
};

export const DEFAULT_HABITS = [
  { id: 1, name: "Running", emoji: "🏃", target: 1, unit: "x/week", type: "weekly", color: PALETTE.green, progress: 0 },
  { id: 2, name: "Gym", emoji: "🏋️", target: 4, unit: "x/week", type: "weekly", color: PALETTE.accent, progress: 0 },
  { id: 3, name: "Water", emoji: "💧", target: 3, unit: "L/day", type: "daily", color: PALETTE.blue, progress: 0 },
  { id: 4, name: "Meditation", emoji: "🧘", target: 1, unit: "x/day", type: "daily", color: PALETTE.orange, progress: 0 },
];

export const DEFAULT_SUPPLEMENTS = [
  { id: 1, name: "Creatine", dose: "5g", time: "08:00", taken: false, color: PALETTE.accent },
  { id: 2, name: "Vitamin D3", dose: "4000 IU", time: "08:00", taken: false, color: PALETTE.gold },
  { id: 3, name: "Omega-3", dose: "2 caps", time: "13:00", taken: false, color: PALETTE.blue },
  { id: 4, name: "Magnesium", dose: "400mg", time: "21:00", taken: false, color: PALETTE.green },
];

export const WEEK_DATA = [
  { day: "Mon", gym: 1, water: 2.8, running: 0 },
  { day: "Tue", gym: 1, water: 3.1, running: 1 },
  { day: "Wed", gym: 0, water: 2.5, running: 0 },
  { day: "Thu", gym: 1, water: 3.0, running: 0 },
  { day: "Fri", gym: 0, water: 2.2, running: 0 },
  { day: "Sat", gym: 1, water: 3.3, running: 0 },
  { day: "Sun", gym: 0, water: 1.9, running: 0 },
];

export const MONTHLY_DATA = [
  { week: "W1", score: 72 }, { week: "W2", score: 85 }, { week: "W3", score: 68 },
  { week: "W4", score: 91 }, { week: "W5", score: 88 },
];

export const PLAYLIST = [
  { id: 1, title: "How to Build Discipline", channel: "Andrew Huberman", thumb: "🎬", duration: "1:22:14", tag: "Mindset" },
  { id: 2, title: "Morning Routine for Peak Performance", channel: "Tom Bilyeu", thumb: "🎬", duration: "18:42", tag: "Routine" },
  { id: 3, title: "The Science of Muscle Growth", channel: "Jeff Nippard", thumb: "🎬", duration: "24:08", tag: "Fitness" },
  { id: 4, title: "Skincare Routine for Men 2024", channel: "Alex Costa", thumb: "🎬", duration: "11:33", tag: "Grooming" },
  { id: 5, title: "Sleep Optimization Guide", channel: "Matt Walker", thumb: "🎬", duration: "58:01", tag: "Recovery" },
];

export const DEFAULT_STORE_ITEMS = [
  { id: 1, name: "Iron Gloves", icon: "🥊", cost: 150, rarity: "Rare", stat: "+10 Strength", owned: false },
  { id: 2, name: "Protein Crown", icon: "👑", cost: 500, rarity: "Epic", stat: "+25 Gains", owned: false },
  { id: 3, name: "Discipline Cloak", icon: "🧣", cost: 300, rarity: "Rare", stat: "+15 Focus", owned: true },
  { id: 4, name: "Recovery Boots", icon: "👟", cost: 200, rarity: "Common", stat: "+8 Speed", owned: false },
];

export const DEFAULT_CALENDAR_EVENTS = [
  { day: 3, label: "Leg Day", color: PALETTE.accent },
  { day: 7, label: "Rest + Meal Prep", color: PALETTE.green },
  { day: 10, label: "5km Run", color: PALETTE.orange },
  { day: 14, label: "Check-in", color: PALETTE.gold },
  { day: 18, label: "Upper Body", color: PALETTE.accent },
  { day: 22, label: "Blood Test", color: PALETTE.red },
  { day: 26, label: "New Cycle", color: PALETTE.green },
];

export const XP_INITIAL = 3420;
export const LEVEL = 12;
export const XP_NEXT = 4000;
export const COINS_INITIAL = 840;
export const STREAK = 14;

export const RC4_APP_KEY = "jhabits-v1-local";

export const NAV_ITEMS = [
  { id: "habits", label: "Habits", icon: "🎯" },
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "lessons", label: "Learn", icon: "▶️" },
  { id: "character", label: "Level Up", icon: "⚔️" },
  { id: "calendar", label: "Calendar", icon: "📅" },
];
