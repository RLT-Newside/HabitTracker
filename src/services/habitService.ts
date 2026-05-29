import { Habit, Completion, Task, Goal, FrequencyType } from '../types'
import { v4 as uuid } from 'uuid'

const KEYS = {
  habits: 'habits_list',
  completions: 'habits_completions',
  tasks: 'habits_tasks',
} as const

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

export const habitService = {
  getAll(): Habit[] {
    return load<Habit[]>(KEYS.habits, [])
  },

  getActive(): Habit[] {
    return this.getAll().filter(h => !h.archived)
  },

  getById(id: string): Habit | undefined {
    return this.getAll().find(h => h.id === id)
  },

  create(input: { name: string; description?: string; color: string; goals: Omit<Goal, 'id'>[] }): Habit {
    const habits = this.getAll()
    const habit: Habit = {
      id: uuid(),
      name: input.name,
      description: input.description || '',
      icon: 'check',
      color: input.color,
      sortOrder: habits.length,
      archived: false,
      createdAt: new Date().toISOString(),
      goals: input.goals.map(g => ({ ...g, id: uuid() })),
    }
    save(KEYS.habits, [...habits, habit])
    return habit
  },

  update(id: string, fields: Partial<Habit>): Habit | undefined {
    const habits = this.getAll()
    const idx = habits.findIndex(h => h.id === id)
    if (idx < 0) return undefined
    habits[idx] = { ...habits[idx], ...fields }
    save(KEYS.habits, habits)
    return habits[idx]
  },

  delete(id: string): void {
    save(KEYS.habits, this.getAll().filter(h => h.id !== id))
    save(KEYS.completions, completionService.getAll().filter(c => c.habitId !== id))
  },

  archive(id: string): void {
    this.update(id, { archived: true })
  },
}

export const completionService = {
  getAll(): Completion[] {
    return load<Completion[]>(KEYS.completions, [])
  },

  getByDate(date: string): Completion[] {
    return this.getAll().filter(c => c.date === date)
  },

  getByHabit(habitId: string): Completion[] {
    return this.getAll().filter(c => c.habitId === habitId)
  },

  getByHabitInRange(habitId: string, start: string, end: string): Completion[] {
    return this.getAll().filter(c => c.habitId === habitId && c.date >= start && c.date <= end)
  },

  toggle(habitId: string, date: string): boolean {
    const all = this.getAll()
    const existing = all.find(c => c.habitId === habitId && c.date === date)
    if (existing) {
      save(KEYS.completions, all.filter(c => c.id !== existing.id))
      return false
    }
    save(KEYS.completions, [...all, { id: uuid(), habitId, date, value: 1, notes: '', createdAt: new Date().toISOString() }])
    return true
  },

  isCompleted(habitId: string, date: string): boolean {
    return this.getAll().some(c => c.habitId === habitId && c.date === date)
  },
}

export const taskService = {
  getAll(): Task[] {
    return load<Task[]>(KEYS.tasks, [])
  },

  getByDate(date: string): Task[] {
    return this.getAll().filter(t => t.dueDate === date)
  },

  create(input: { title: string; description?: string; dueDate?: string; priority?: 0 | 1 | 2 | 3 }): Task {
    const tasks = this.getAll()
    const task: Task = {
      id: uuid(),
      title: input.title,
      description: input.description || '',
      dueDate: input.dueDate || null,
      completed: false,
      completedAt: null,
      priority: input.priority || 0,
      createdAt: new Date().toISOString(),
    }
    save(KEYS.tasks, [...tasks, task])
    return task
  },

  toggleComplete(id: string): boolean {
    const tasks = this.getAll()
    const idx = tasks.findIndex(t => t.id === id)
    if (idx < 0) return false
    tasks[idx].completed = !tasks[idx].completed
    tasks[idx].completedAt = tasks[idx].completed ? new Date().toISOString() : null
    save(KEYS.tasks, tasks)
    return tasks[idx].completed
  },

  delete(id: string): void {
    save(KEYS.tasks, this.getAll().filter(t => t.id !== id))
  },
}
