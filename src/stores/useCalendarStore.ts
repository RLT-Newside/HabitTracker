import { create } from 'zustand';
import { today } from '../utils/dates';

interface CalendarState {
  selectedDate: string;
  visibleMonth: string;
  setSelectedDate: (date: string) => void;
  setVisibleMonth: (month: string) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: today(),
  visibleMonth: today().slice(0, 7),

  setSelectedDate: (date) => set({ selectedDate: date }),
  setVisibleMonth: (month) => set({ visibleMonth: month }),
}));
