export const HABIT_COLORS = [
  '#D97706', '#F59E0B', '#059669', '#10B981',
  '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
  '#EF4444', '#F97316', '#14B8A6', '#06B6D4',
] as const;

export const HABIT_ICONS = [
  'check-circle', 'book', 'fitness', 'water',
  'nutrition', 'moon', 'walk', 'code',
  'musical-notes', 'brush', 'meditate', 'heart',
  'flash', 'leaf', 'barbell', 'pencil',
] as const;

export const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export const DB_NAME = 'jhabits.db';
export const DB_VERSION = 1;
