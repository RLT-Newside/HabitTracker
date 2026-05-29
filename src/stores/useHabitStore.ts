import { create } from 'zustand';
import { HabitWithProgress, CreateHabitInput, GoalProgress } from '../types/habit';
import { habitRepository } from '../db/repositories/habitRepository';
import { completionRepository } from '../db/repositories/completionRepository';
import { today } from '../utils/dates';
import { statsEngine } from '../services/statsEngine';

interface HabitState {
  habits: HabitWithProgress[];
  loading: boolean;
  loadHabits: () => Promise<void>;
  createHabit: (input: CreateHabitInput) => Promise<string>;
  toggleCompletion: (habitId: string) => Promise<void>;
  archiveHabit: (habitId: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: false,

  loadHabits: async () => {
    set({ loading: true });
    const habitsWithGoals = await habitRepository.getAllWithGoals();
    const date = today();
    const completedIds = await completionRepository.getCompletedHabitIdsForDate(date);

    const habits: HabitWithProgress[] = await Promise.all(
      habitsWithGoals.map(async (h) => {
        const goalProgress = await statsEngine.calculateGoalProgress(h.id, date);
        const streak = await statsEngine.getCurrentStreak(h.id, date);
        return {
          ...h,
          todayCompleted: completedIds.includes(h.id),
          currentStreak: streak,
          goalProgress,
        };
      })
    );

    set({ habits, loading: false });
  },

  createHabit: async (input) => {
    const id = await habitRepository.create(input);
    await get().loadHabits();
    return id;
  },

  toggleCompletion: async (habitId) => {
    const date = today();
    await completionRepository.toggle(habitId, date);
    await get().loadHabits();
  },

  archiveHabit: async (habitId) => {
    await habitRepository.archive(habitId);
    await get().loadHabits();
  },

  deleteHabit: async (habitId) => {
    await habitRepository.delete(habitId);
    await get().loadHabits();
  },
}));
