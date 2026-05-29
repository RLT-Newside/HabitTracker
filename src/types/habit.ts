export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  habitId: string;
  frequency: FrequencyType;
  targetCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string;
  value: number;
  notes: string;
  createdAt: string;
}

export interface HabitWithGoals extends Habit {
  goals: Goal[];
}

export interface GoalProgress {
  goalId: string;
  habitId: string;
  frequency: FrequencyType;
  targetCount: number;
  currentCount: number;
  percentage: number;
  periodStart: string;
  periodEnd: string;
  onTrack: boolean;
}

export interface HabitWithProgress extends HabitWithGoals {
  todayCompleted: boolean;
  currentStreak: number;
  goalProgress: GoalProgress[];
}

export interface CreateHabitInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  goals: CreateGoalInput[];
}

export interface CreateGoalInput {
  frequency: FrequencyType;
  targetCount: number;
}
