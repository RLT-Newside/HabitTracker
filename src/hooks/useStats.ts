import { Habit, Completion, GoalProgress, FrequencyType, StreakInfo } from '../types'

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function addDays(iso: string, days: number): string {
  const d = parseDate(iso)
  d.setDate(d.getDate() + days)
  return formatISO(d)
}

function weekStart(date: string): string {
  const d = parseDate(date)
  const day = d.getDay()
  const diff = (day === 0 ? 6 : day - 1)
  d.setDate(d.getDate() - diff)
  return formatISO(d)
}

function weekEnd(date: string): string {
  const s = parseDate(weekStart(date))
  s.setDate(s.getDate() + 6)
  return formatISO(s)
}

function monthStart(date: string): string {
  const d = parseDate(date)
  return formatISO(new Date(d.getFullYear(), d.getMonth(), 1))
}

function monthEnd(date: string): string {
  const d = parseDate(date)
  return formatISO(new Date(d.getFullYear(), d.getMonth() + 1, 0))
}

function yearStart(date: string): string {
  return date.slice(0, 4) + '-01-01'
}

function yearEnd(date: string): string {
  return date.slice(0, 4) + '-12-31'
}

function daysBetween(start: string, end: string): number {
  return Math.round((parseDate(end).getTime() - parseDate(start).getTime()) / 86400000)
}

export function getPeriodBounds(frequency: FrequencyType, date: string): { start: string; end: string } {
  switch (frequency) {
    case 'daily': return { start: date, end: date }
    case 'weekly': return { start: weekStart(date), end: weekEnd(date) }
    case 'monthly': return { start: monthStart(date), end: monthEnd(date) }
    case 'yearly': return { start: yearStart(date), end: yearEnd(date) }
  }
}

export function getCompletionCount(completions: Completion[], habitId: string, start: string, end: string): number {
  return completions.filter(c => c.habitId === habitId && c.date >= start && c.date <= end).length
}

export function calculateGoalProgress(habit: Habit, completions: Completion[], refDate?: string): GoalProgress[] {
  const date = refDate || today()
  return habit.goals.map(goal => {
    const { start, end } = getPeriodBounds(goal.frequency, date)
    const currentCount = getCompletionCount(completions, habit.id, start, end)
    const percentage = Math.min(100, Math.round((currentCount / goal.targetCount) * 100))
    const totalDays = daysBetween(start, end) + 1
    const elapsed = daysBetween(start, date) + 1
    const onTrack = elapsed >= totalDays ? currentCount >= goal.targetCount : (currentCount / elapsed) * totalDays >= goal.targetCount
    return { goalId: goal.id, frequency: goal.frequency, targetCount: goal.targetCount, currentCount, percentage, periodStart: start, periodEnd: end, onTrack }
  })
}

export function getCurrentStreak(completions: Completion[], habitId: string): number {
  const dates = [...new Set(completions.filter(c => c.habitId === habitId).map(c => c.date))].sort().reverse()
  if (dates.length === 0) return 0
  let checkDate = today()
  if (!dates.includes(checkDate)) {
    checkDate = addDays(checkDate, -1)
    if (!dates.includes(checkDate)) return 0
  }
  const dateSet = new Set(dates)
  let streak = 0
  while (dateSet.has(checkDate)) {
    streak++
    checkDate = addDays(checkDate, -1)
  }
  return streak
}

export function getLongestStreak(completions: Completion[], habitId: string): number {
  const dates = [...new Set(completions.filter(c => c.habitId === habitId).map(c => c.date))].sort()
  if (dates.length === 0) return 0
  let longest = 1, current = 1
  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }
  return longest
}

export function getStreakInfo(completions: Completion[], habitId: string): StreakInfo {
  return { current: getCurrentStreak(completions, habitId), longest: getLongestStreak(completions, habitId) }
}

export function isTodayCompleted(completions: Completion[], habitId: string): boolean {
  return completions.some(c => c.habitId === habitId && c.date === today())
}

export function getToday(): string {
  return today()
}

export function getCompletionsForMonth(completions: Completion[], month: string): Record<string, string[]> {
  const start = month + '-01'
  const end = monthEnd(start)
  const map: Record<string, string[]> = {}
  for (const c of completions) {
    if (c.date >= start && c.date <= end) {
      if (!map[c.date]) map[c.date] = []
      if (!map[c.date].includes(c.habitId)) map[c.date].push(c.habitId)
    }
  }
  return map
}
