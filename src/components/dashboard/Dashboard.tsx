import { useState, useCallback } from 'react'
import { Plus, Flame, Check, Circle, Target, TrendingUp } from 'lucide-react'
import { Habit, Completion } from '../../types'
import { isTodayCompleted, calculateGoalProgress, getCurrentStreak, getToday } from '../../hooks/useStats'
import { ProgressRing } from '../shared/ProgressRing'
import { FREQUENCY_LABELS } from '../../types'

interface DashboardProps {
  habits: Habit[]
  completions: Completion[]
  onToggle: (habitId: string) => void
  onAddHabit: () => void
  onHabitDetail: (habit: Habit) => void
}

export function Dashboard({ habits, completions, onToggle, onAddHabit, onHabitDetail }: DashboardProps) {
  const activeHabits = habits.filter(h => !h.archived)
  const completedCount = activeHabits.filter(h => isTodayCompleted(completions, h.id)).length
  const totalCount = activeHabits.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const [justCompleted, setJustCompleted] = useState<string | null>(null)

  const handleToggle = useCallback((habitId: string) => {
    if (!isTodayCompleted(completions, habitId)) {
      setJustCompleted(habitId)
      setTimeout(() => setJustCompleted(null), 600)
    }
    onToggle(habitId)
  }, [completions, onToggle])

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-40 px-8 gap-5">
        <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center">
          <Target size={36} className="text-brand" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="font-heading text-2xl">START YOUR JOURNEY</p>
          <p className="text-sm text-white/30">Create your first habit to begin tracking</p>
        </div>
        <button
          onClick={onAddHabit}
          className="mt-2 px-8 py-3 bg-brand text-white rounded-2xl font-semibold text-sm active:scale-95 transition-all shadow-lg shadow-brand/20"
        >
          Create Habit
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pb-28 space-y-5">
      {/* Stats row */}
      <div className="space-y-3 pt-2">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-medium">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
            <TrendingUp size={14} className="mx-auto text-white/20 mb-1" />
            <p className="font-heading text-2xl text-brand">{pct}%</p>
            <p className="text-[9px] text-white/30 uppercase tracking-wider">Today</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
            <Check size={14} className="mx-auto text-white/20 mb-1" />
            <p className="font-heading text-2xl">{completedCount}<span className="text-white/30">/{totalCount}</span></p>
            <p className="text-[9px] text-white/30 uppercase tracking-wider">Done</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
            <Flame size={14} className="mx-auto text-brand/50 mb-1" />
            <p className="font-heading text-2xl text-brand">
              {Math.max(...activeHabits.map(h => getCurrentStreak(completions, h.id)), 0)}
            </p>
            <p className="text-[9px] text-white/30 uppercase tracking-wider">Best Streak</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-white/[0.04] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand to-brand/70 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Habits list */}
      <div className="space-y-2">
        <h2 className="font-heading text-lg tracking-wide text-white/60">HABITS</h2>
        {activeHabits.map(habit => {
          const done = isTodayCompleted(completions, habit.id)
          const streak = getCurrentStreak(completions, habit.id)
          const progress = calculateGoalProgress(habit, completions)
          const primary = progress[0]
          const isJustDone = justCompleted === habit.id

          return (
            <div
              key={habit.id}
              className={`group flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                done
                  ? 'bg-white/[0.02] border-white/[0.03]'
                  : 'bg-[#1a1a1a] border-white/[0.04] hover:border-white/[0.08] hover:bg-[#1e1e1e]'
              }`}
            >
              <button
                onClick={() => handleToggle(habit.id)}
                className="shrink-0 active:scale-75 transition-transform"
              >
                {done ? (
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${isJustDone ? 'animate-check-pop' : ''}`}
                    style={{ backgroundColor: habit.color, boxShadow: `0 4px 12px ${habit.color}30` }}
                  >
                    <Check size={18} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl border-2 border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                    <Circle size={14} className="text-white/10" />
                  </div>
                )}
              </button>

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onHabitDetail(habit)}>
                <p className={`font-medium text-[15px] truncate transition-all ${done ? 'line-through text-white/20' : 'text-white/90'}`}>
                  {habit.name}
                </p>
                <div className="flex items-center gap-2.5 mt-0.5">
                  {streak > 0 && (
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-400/80">
                      <Flame size={11} />{streak}
                    </span>
                  )}
                  {primary && (
                    <span className="text-[11px] text-white/25 font-medium">
                      {primary.currentCount}/{primary.targetCount} {FREQUENCY_LABELS[primary.frequency].toLowerCase()}
                    </span>
                  )}
                </div>
              </div>

              {primary && (
                <ProgressRing
                  percentage={primary.percentage}
                  size={42}
                  strokeWidth={3.5}
                  color={habit.color}
                  showLabel={false}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* FAB */}
      <button
        onClick={onAddHabit}
        className="fixed bottom-24 w-12 h-12 bg-brand rounded-2xl flex items-center justify-center shadow-xl shadow-brand/25 active:scale-90 transition-all hover:shadow-brand/40"
        style={{ right: 'max(16px, calc(50% - 199px))' }}
      >
        <Plus size={22} className="text-white" strokeWidth={2.5} />
      </button>
    </div>
  )
}
