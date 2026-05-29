export type Tab = 'dashboard' | 'calendar' | 'stats' | 'settings'

export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface Habit {
  id: string
  name: string
  description: string
  icon: string
  color: string
  sortOrder: number
  archived: boolean
  createdAt: string
  goals: Goal[]
}

export interface Goal {
  id: string
  frequency: FrequencyType
  targetCount: number
}

export interface Completion {
  id: string
  habitId: string
  date: string
  value: number
  notes: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string | null
  completed: boolean
  completedAt: string | null
  priority: 0 | 1 | 2 | 3
  createdAt: string
}

export interface GoalProgress {
  goalId: string
  frequency: FrequencyType
  targetCount: number
  currentCount: number
  percentage: number
  periodStart: string
  periodEnd: string
  onTrack: boolean
}

export interface StreakInfo {
  current: number
  longest: number
}

export const HABIT_COLORS = [
  '#d97706', '#f59e0b', '#059669', '#10b981',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#ef4444', '#f97316', '#14b8a6', '#06b6d4',
]

export const FREQUENCY_LABELS: Record<FrequencyType, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
}
