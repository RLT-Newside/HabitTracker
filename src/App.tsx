import { useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { Tab, Habit, Completion, Task } from './types'
import { useStorage } from './hooks/useStorage'
import { useTheme } from './hooks/useTheme'
import { getToday } from './hooks/useStats'
import { Header } from './components/layout/Header'
import { BottomNav } from './components/layout/BottomNav'
import { Dashboard } from './components/dashboard/Dashboard'
import { CalendarView } from './components/calendar/CalendarView'
import { StatsView } from './components/stats/StatsView'
import { HabitForm } from './components/habits/HabitForm'
import { SettingsModal } from './components/settings/SettingsModal'

export default function App() {
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [habits, setHabits] = useStorage<Habit[]>('habits_list', [])
  const [completions, setCompletions] = useStorage<Completion[]>('habits_completions', [])
  const [tasks, setTasks] = useStorage<Task[]>('habits_tasks', [])

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [habitFormOpen, setHabitFormOpen] = useState(false)
  const [editHabit, setEditHabit] = useState<Habit | null>(null)
  const [selectedDate, setSelectedDate] = useState(getToday())

  const handleToggle = useCallback((habitId: string) => {
    const date = getToday()
    setCompletions(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === date)
      if (existing) return prev.filter(c => c.id !== existing.id)
      return [...prev, { id: uuid(), habitId, date, value: 1, notes: '', createdAt: new Date().toISOString() }]
    })
  }, [setCompletions])

  const handleSaveHabit = useCallback((habit: Habit) => {
    setHabits(prev => {
      const idx = prev.findIndex(h => h.id === habit.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = habit
        return next
      }
      return [...prev, { ...habit, sortOrder: prev.length }]
    })
    setEditHabit(null)
  }, [setHabits])

  const handleHabitDetail = useCallback((habit: Habit) => {
    setEditHabit(habit)
    setHabitFormOpen(true)
  }, [])

  const handleImport = useCallback((data: { habits: Habit[]; completions: Completion[]; tasks: Task[] }) => {
    setHabits(data.habits)
    setCompletions(data.completions)
    setTasks(data.tasks || [])
  }, [setHabits, setCompletions, setTasks])

  return (
    <>
      <Header onSettingsOpen={() => setSettingsOpen(true)} />

      <main className="pb-16">
        {tab === 'dashboard' && (
          <Dashboard
            habits={habits}
            completions={completions}
            onToggle={handleToggle}
            onAddHabit={() => { setEditHabit(null); setHabitFormOpen(true) }}
            onHabitDetail={handleHabitDetail}
          />
        )}
        {tab === 'calendar' && (
          <CalendarView
            habits={habits}
            completions={completions}
            selectedDate={selectedDate}
            onDaySelect={setSelectedDate}
          />
        )}
        {tab === 'stats' && (
          <StatsView habits={habits} completions={completions} />
        )}
      </main>

      <BottomNav activeTab={tab} onTabChange={setTab} />

      <HabitForm
        open={habitFormOpen}
        onClose={() => { setHabitFormOpen(false); setEditHabit(null) }}
        onSave={handleSaveHabit}
        editHabit={editHabit}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        habits={habits}
        completions={completions}
        tasks={tasks}
        onImport={handleImport}
      />
    </>
  )
}
