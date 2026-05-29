import { useEffect, useCallback, useMemo } from 'react'
import { useHabitStore } from './stores/habitStore'
import { useNavStore } from './stores/navStore'
import { useTheme } from './hooks/useTheme'
import { getToday, getCurrentStreak } from './hooks/useStats'
import { tapMedium, tapSuccess } from './services/haptics'
import { Header } from './components/layout/Header'
import { BottomNav } from './components/layout/BottomNav'
import { Dashboard } from './components/dashboard/Dashboard'
import { CalendarView } from './components/calendar/CalendarView'
import { StatsView } from './components/stats/StatsView'
import { HabitForm } from './components/habits/HabitForm'
import { SettingsModal } from './components/settings/SettingsModal'

export default function App() {
  const { theme, setTheme } = useTheme()
  const { tab, setTab, selectedDate, setSelectedDate, settingsOpen, openSettings, closeSettings, habitFormOpen, editHabitId, openHabitForm, closeHabitForm, goBack } = useNavStore()
  const { habits, completions, tasks, toggleCompletion, addHabit, updateHabit, deleteHabit, importData } = useHabitStore()

  const editHabit = useMemo(() => editHabitId ? habits.find(h => h.id === editHabitId) || null : null, [editHabitId, habits])

  const bestStreak = useMemo(() => {
    const active = habits.filter(h => !h.archived)
    if (active.length === 0) return 0
    return Math.max(...active.map(h => getCurrentStreak(completions, h.id)))
  }, [habits, completions])

  // Android hardware back button
  useEffect(() => {
    function handleBackButton(e: PopStateEvent) {
      const handled = goBack()
      if (handled) {
        e.preventDefault()
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handleBackButton)
    return () => window.removeEventListener('popstate', handleBackButton)
  }, [goBack])

  const handleToggle = useCallback((habitId: string) => {
    const date = getToday()
    const completed = toggleCompletion(habitId, date)
    if (completed) tapSuccess()
    else tapMedium()
  }, [toggleCompletion])

  const handleSaveHabit = useCallback((habit: import('./types').Habit) => {
    if (habits.find(h => h.id === habit.id)) {
      updateHabit(habit)
    } else {
      addHabit(habit)
    }
    closeHabitForm()
  }, [habits, addHabit, updateHabit, closeHabitForm])

  const handleDeleteHabit = useCallback((id: string) => {
    deleteHabit(id)
    closeHabitForm()
  }, [deleteHabit, closeHabitForm])

  return (
    <>
      <Header onSettingsOpen={openSettings} streak={bestStreak} />

      <main className="pb-16">
        {tab === 'dashboard' && (
          <Dashboard
            habits={habits}
            completions={completions}
            onToggle={handleToggle}
            onAddHabit={() => openHabitForm()}
            onHabitDetail={(h) => openHabitForm(h.id)}
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
        onClose={closeHabitForm}
        onSave={handleSaveHabit}
        onDelete={handleDeleteHabit}
        editHabit={editHabit}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={closeSettings}
        theme={theme}
        setTheme={setTheme}
        habits={habits}
        completions={completions}
        tasks={tasks}
        onImport={importData}
      />
    </>
  )
}
