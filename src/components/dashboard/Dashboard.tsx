import { useState, useCallback } from 'react'
import { Plus, Flame, Check, Circle, TrendingUp, Target, Sparkles } from 'lucide-react'
import { Habit, Completion, FREQUENCY_LABELS } from '../../types'
import { isTodayCompleted, calculateGoalProgress, getCurrentStreak, getToday } from '../../hooks/useStats'
import { ProgressRing } from '../shared/ProgressRing'

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
  const bestStreak = Math.max(...activeHabits.map(h => getCurrentStreak(completions, h.id)), 0)
  const [justCompleted, setJustCompleted] = useState<string | null>(null)

  const handleToggle = useCallback((habitId: string) => {
    if (!isTodayCompleted(completions, habitId)) {
      setJustCompleted(habitId)
      setTimeout(() => setJustCompleted(null), 700)
    }
    onToggle(habitId)
  }, [completions, onToggle])

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-36 px-8 gap-6 animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-[var(--color-brand)]/5 border border-[var(--color-brand)]/10 flex items-center justify-center animate-pulse-glow">
          <Sparkles size={40} className="text-[var(--color-brand)]" />
        </div>
        <div className="text-center space-y-2">
          <p className="font-heading text-3xl tracking-wider text-white">START BUILDING</p>
          <p className="text-sm text-white/30 leading-relaxed">Create your first habit and begin<br />tracking your progress</p>
        </div>
        <button
          onClick={onAddHabit}
          className="mt-3 px-10 py-3.5 bg-[var(--color-brand)] text-white rounded-2xl font-bold text-sm uppercase tracking-wider active:scale-95 transition-all shadow-[0_8px_32px_rgba(var(--color-brand-rgb),0.3)]"
        >
          Create Habit
        </button>
      </div>
    )
  }

  return (
    <div className="px-5 pb-28 space-y-5 animate-fade-in">
      {/* Date + Stats */}
      <div className="space-y-4 pt-1">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="card p-3.5 text-center">
            <TrendingUp size={13} className="mx-auto text-white/15 mb-1.5" />
            <p className="font-heading text-[26px] text-[var(--color-brand)]">{pct}%</p>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">Progress</p>
          </div>
          <div className="card p-3.5 text-center">
            <Target size={13} className="mx-auto text-white/15 mb-1.5" />
            <p className="font-heading text-[26px]">{completedCount}<span className="text-white/20 text-[18px]">/{totalCount}</span></p>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">Complete</p>
          </div>
          <div className="card p-3.5 text-center">
            <Flame size={13} className="mx-auto text-[var(--color-brand)]/40 mb-1.5" />
            <p className="font-heading text-[26px] text-[var(--color-brand)]">{bestStreak}</p>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">Streak</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, var(--color-brand), var(--color-brand)90)`,
              boxShadow: `0 0 12px rgba(var(--color-brand-rgb), 0.4)`,
            }}
          />
        </div>
      </div>

      {/* Habits */}
      <div className="space-y-2">
        <h2 className="font-heading text-[15px] tracking-[0.15em] text-white/30">TODAY&apos;S HABITS</h2>

        {activeHabits.map((habit, idx) => {
          const done = isTodayCompleted(completions, habit.id)
          const streak = getCurrentStreak(completions, habit.id)
          const progress = calculateGoalProgress(habit, completions)
          const primary = progress[0]
          const isJustDone = justCompleted === habit.id

          return (
            <div
              key={habit.id}
              className={`card card-hover flex items-center gap-3.5 p-4 animate-slide-up`}
              style={{ animationDelay: `${idx * 30}ms`, animationFillMode: 'both' }}
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(habit.id)}
                className="shrink-0 active:scale-75 transition-transform"
              >
                {done ? (
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${isJustDone ? 'animate-check-pop' : ''}`}
                    style={{
                      backgroundColor: habit.color,
                      boxShadow: `0 4px 16px ${habit.color}40`,
                    }}
                  >
                    <Check size={20} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl border-2 border-white/[0.08] flex items-center justify-center hover:border-white/[0.15] transition-colors">
                    <Circle size={12} className="text-white/[0.06]" />
                  </div>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onHabitDetail(habit)}>
                <p className={`font-semibold text-[15px] truncate transition-all ${done ? 'line-through text-white/15' : 'text-white/90'}`}>
                  {habit.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {streak > 0 && (
                    <span className={`flex items-center gap-[3px] text-[11px] font-black ${streak >= 7 ? 'text-[var(--color-brand)]' : 'text-amber-400/70'}`}>
                      <Flame size={11} className={isJustDone && !done ? '' : streak >= 7 ? 'animate-streak-fire' : ''} />
                      {streak}d
                    </span>
                  )}
                  {primary && (
                    <span className="text-[11px] text-white/20 font-medium">
                      {primary.currentCount}/{primary.targetCount} {FREQUENCY_LABELS[primary.frequency].toLowerCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress ring */}
              {primary && (
                <ProgressRing
                  percentage={primary.percentage}
                  size={44}
                  strokeWidth={3.5}
                  color={habit.color}
                  showLabel={false}
                  glow={done}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* FAB */}
      <button
        onClick={onAddHabit}
        className="fixed bottom-[88px] w-[50px] h-[50px] bg-[var(--color-brand)] rounded-[16px] flex items-center justify-center active:scale-90 transition-all shadow-[0_6px_24px_rgba(var(--color-brand-rgb),0.35)]"
        style={{ right: 'max(20px, calc(50% - 195px))' }}
      >
        <Plus size={22} className="text-white" strokeWidth={2.5} />
      </button>
    </div>
  )
}
