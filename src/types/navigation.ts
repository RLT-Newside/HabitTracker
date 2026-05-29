export type RootTabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  StatsTab: undefined;
  SettingsTab: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  HabitDetail: { habitId: string };
  AddEditHabit: { habitId?: string };
  TaskDetail: { taskId: string };
};

export type CalendarStackParamList = {
  Calendar: undefined;
  DayDetail: { date: string };
};

export type StatsStackParamList = {
  StatsOverview: undefined;
  HabitStats: { habitId: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};
