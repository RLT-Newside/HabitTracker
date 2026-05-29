import { GoalProgress } from './habit';

export interface StreakInfo {
  current: number;
  longest: number;
  lastCompletedDate: string | null;
}

export interface HabitStats {
  habitId: string;
  totalCompletions: number;
  streakInfo: StreakInfo;
  goalProgress: GoalProgress[];
  completionsByMonth: Record<string, number>;
  averagePerWeek: number;
}

export interface DaySummary {
  date: string;
  habitsCompleted: number;
  habitsTotal: number;
  completedHabitIds: string[];
}
