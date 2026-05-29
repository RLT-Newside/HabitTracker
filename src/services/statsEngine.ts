import { FrequencyType, GoalProgress } from '../types/habit';
import { StreakInfo, HabitStats } from '../types/stats';
import { completionRepository } from '../db/repositories/completionRepository';
import { goalRepository } from '../db/repositories/goalRepository';
import {
  today,
  weekStart,
  weekEnd,
  monthStart,
  monthEnd,
  yearStart,
  yearEnd,
  daysBetween,
  addDays,
} from '../utils/dates';

export function getPeriodBounds(frequency: FrequencyType, date: string): { start: string; end: string } {
  switch (frequency) {
    case 'daily':
      return { start: date, end: date };
    case 'weekly':
      return { start: weekStart(date), end: weekEnd(date) };
    case 'monthly':
      return { start: monthStart(date), end: monthEnd(date) };
    case 'yearly':
      return { start: yearStart(date), end: yearEnd(date) };
  }
}

function isOnTrack(
  currentCount: number,
  targetCount: number,
  periodStart: string,
  periodEnd: string,
  referenceDate: string
): boolean {
  const totalDays = daysBetween(periodStart, periodEnd) + 1;
  const elapsed = daysBetween(periodStart, referenceDate) + 1;
  if (elapsed >= totalDays) return currentCount >= targetCount;
  const projectedRate = currentCount / elapsed;
  return projectedRate * totalDays >= targetCount;
}

export const statsEngine = {
  async calculateGoalProgress(habitId: string, referenceDate?: string): Promise<GoalProgress[]> {
    const date = referenceDate ?? today();
    const goals = await goalRepository.getByHabitId(habitId);
    const progress: GoalProgress[] = [];

    for (const goal of goals) {
      const { start, end } = getPeriodBounds(goal.frequency, date);
      const currentCount = await completionRepository.getCountInRange(habitId, start, end);
      const percentage = Math.min(100, Math.round((currentCount / goal.targetCount) * 100));

      progress.push({
        goalId: goal.id,
        habitId,
        frequency: goal.frequency,
        targetCount: goal.targetCount,
        currentCount,
        percentage,
        periodStart: start,
        periodEnd: end,
        onTrack: isOnTrack(currentCount, goal.targetCount, start, end, date),
      });
    }

    return progress;
  },

  async getCurrentStreak(habitId: string, referenceDate?: string): Promise<number> {
    const date = referenceDate ?? today();
    const dates = await completionRepository.getAllDatesForHabit(habitId);
    if (dates.length === 0) return 0;

    let streak = 0;
    let checkDate = date;

    // If not completed today, start from yesterday
    if (!dates.includes(checkDate)) {
      checkDate = addDays(checkDate, -1);
      if (!dates.includes(checkDate)) return 0;
    }

    const dateSet = new Set(dates);
    while (dateSet.has(checkDate)) {
      streak++;
      checkDate = addDays(checkDate, -1);
    }

    return streak;
  },

  async getLongestStreak(habitId: string): Promise<number> {
    const dates = await completionRepository.getAllDatesForHabit(habitId);
    if (dates.length === 0) return 0;

    const sorted = [...dates].sort();
    let longest = 1;
    let current = 1;

    for (let i = 1; i < sorted.length; i++) {
      if (daysBetween(sorted[i - 1], sorted[i]) === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    return longest;
  },

  async getStreakInfo(habitId: string): Promise<StreakInfo> {
    const dates = await completionRepository.getAllDatesForHabit(habitId);
    return {
      current: await this.getCurrentStreak(habitId),
      longest: await this.getLongestStreak(habitId),
      lastCompletedDate: dates.length > 0 ? dates[0] : null,
    };
  },

  async getHabitStats(habitId: string): Promise<HabitStats> {
    const dates = await completionRepository.getAllDatesForHabit(habitId);
    const streakInfo = await this.getStreakInfo(habitId);
    const goalProgress = await this.calculateGoalProgress(habitId);
    const completionsByMonth = await completionRepository.getMonthlyCountsForHabit(habitId);

    let averagePerWeek = 0;
    if (dates.length > 0) {
      const sorted = [...dates].sort();
      const firstDate = sorted[0];
      const weeks = Math.max(1, daysBetween(firstDate, today()) / 7);
      averagePerWeek = Math.round((dates.length / weeks) * 10) / 10;
    }

    return {
      habitId,
      totalCompletions: dates.length,
      streakInfo,
      goalProgress,
      completionsByMonth,
      averagePerWeek,
    };
  },
};
