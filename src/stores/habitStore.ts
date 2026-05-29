import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { Habit, Completion, Task } from '../types'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

interface HabitStore {
  habits: Habit[]
  completions: Completion[]
  tasks: Task[]

  loadAll: () => void
  addHabit: (habit: Habit) => void
  updateHabit: (habit: Habit) => void
  deleteHabit: (id: string) => void
  toggleCompletion: (habitId: string, date: string) => boolean
  addTask: (task: Task) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  importData: (data: { habits: Habit[]; completions: Completion[]; tasks: Task[] }) => void
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: load<Habit[]>('habits_list', []),
  completions: load<Completion[]>('habits_completions', []),
  tasks: load<Task[]>('habits_tasks', []),

  loadAll: () => {
    set({
      habits: load<Habit[]>('habits_list', []),
      completions: load<Completion[]>('habits_completions', []),
      tasks: load<Task[]>('habits_tasks', []),
    })
  },

  addHabit: (habit) => {
    const habits = [...get().habits, { ...habit, sortOrder: get().habits.length }]
    save('habits_list', habits)
    set({ habits })
  },

  updateHabit: (habit) => {
    const habits = get().habits.map(h => h.id === habit.id ? habit : h)
    save('habits_list', habits)
    set({ habits })
  },

  deleteHabit: (id) => {
    const habits = get().habits.filter(h => h.id !== id)
    const completions = get().completions.filter(c => c.habitId !== id)
    save('habits_list', habits)
    save('habits_completions', completions)
    set({ habits, completions })
  },

  toggleCompletion: (habitId, date) => {
    const completions = get().completions
    const existing = completions.find(c => c.habitId === habitId && c.date === date)
    let next: Completion[]
    let completed: boolean

    if (existing) {
      next = completions.filter(c => c.id !== existing.id)
      completed = false
    } else {
      next = [...completions, {
        id: uuid(),
        habitId,
        date,
        value: 1,
        notes: '',
        createdAt: new Date().toISOString(),
      }]
      completed = true
    }

    save('habits_completions', next)
    set({ completions: next })
    return completed
  },

  addTask: (task) => {
    const tasks = [...get().tasks, task]
    save('habits_tasks', tasks)
    set({ tasks })
  },

  toggleTask: (id) => {
    const tasks = get().tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null } : t
    )
    save('habits_tasks', tasks)
    set({ tasks })
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter(t => t.id !== id)
    save('habits_tasks', tasks)
    set({ tasks })
  },

  importData: (data) => {
    save('habits_list', data.habits)
    save('habits_completions', data.completions)
    save('habits_tasks', data.tasks || [])
    set({ habits: data.habits, completions: data.completions, tasks: data.tasks || [] })
  },
}))
