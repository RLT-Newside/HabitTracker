import { useState, useCallback, useMemo } from 'react'
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
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits])
  const [justCompleted, setJustCompleted] = useState<string | null>(null)

  const habitStats = useMemo(() => {
    return activeHabits.map(h => ({
      habit: h,
      done: isTodayCompleted(completions, h.id),
      streak: getCurrentStreak(completions, h.id),
      progress: calculateGoalProgress(h, completions),
    }))
  }, [activeHabits, completions])

  const completedCount = habitStats.filter(s => s.done).length
  const totalCount = activeHabits.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const bestStreak = useMemo(() => Math.max(...habitStats.map(s => s.streak), 0), [habitStats])

  const handleToggle = useCallback((habitId: string) => {
    if (!isTodayCompleted(completions, habitId)) {
      setJustCompleted(habitId)
      setTimeout(() => setJustCompleted(null), 600)
    }
    onToggle(habitId)
  }, [completions, onToggle])

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70dvh] px-8 gap-5 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-[var(--color-brand)]/5 border border-[var(--color-brand)]/10 flex items-center justify-center animate-pulse-glow">
          <Sparkles size={36} className="text-[var(--color-brand)]" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="font-heading text-[28px] tracking-wider text-white">START BUILDING</p>
          <p className="text-[13px] text-white/30 leading-relaxed">Create your first habit and begin tracking</p>
        </div>
        <button
          onClick={onAddHabit}
          className="mt-2 px-8 py-3.5 bg-[var(--color-brand)] text-white rounded-2xl font-bold text-[13px] uppercase tracking-wider active:scale-95 transition-transform shadow-[0_8px_24px_rgba(var(--color-brand-rgb),0.25)]"
        >
          Create Habit
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24 space-y-4 animate-fade-in">
      {/* Date + Stats */}
      <div className="space-y-3 pt-2">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center">
            <TrendingUp size={12} className="mx-auto text-white/15 mb-1" />
            <p className="font-heading text-[24px] leading-none text-[var(--color-brand)]">{pct}%</p>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Progress</p>
          </div>
          <div className="card p-3 text-center">
            <Target size={12} className="mx-auto text-white/15 mb-1" />
            <p className="font-heading text-[24px] leading-none">{completedCount}<span className="text-white/20 text-[16px]">/{totalCount}</span></p>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Done</p>
          </div>
          <div className="card p-3 text-center">
            <Flame size={12} className="mx-auto text-[var(--color-brand)]/40 mb-1" />
            <p className="font-heading text-[24px] leading-none text-[var(--color-brand)]">{bestStreak}</p>
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Streak</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: 'var(--color-brand)',
              boxShadow: `0 0 8px rgba(var(--color-brand-rgb), 0.3)`,
            }}
          />
        </div>
      </div>

      {/* Habits */}
      <div className="space-y-2">
        <h2 className="font-heading text-[13px] tracking-[0.12em] text-white/25 pl-0.5">HABITS</h2>

        {habitStats.map(({ habit, done, streak, progress }, idx) => {
          const primary = progress[0]
          const isJustDone = justCompleted === habit.id

          return (
            <div
              key={habit.id}
              className="card card-press flex items-center gap-3 p-3.5 animate-slide-up"
              style={{ animationDelay: `${idx * 25}ms` }}
            >
              {/* Touch target: 44x44 minimum */}
              <button
                onClick={() => handleToggle(habit.id)}
                className="shrink-0 w-11 h-11 flex items-center justify-center active:scale-75 transition-transform"
              >
                {done ? (
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${isJustDone ? 'animate-check-pop' : ''}`}
                    style={{ backgroundColor: habit.color, boxShadow: `0 3px 12px ${habit.color}35` }}
                  >
                    <Check size={18} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl border-2 border-white/[0.08] flex items-center justify-center">
                    <Circle size={10} className="text-white/[0.06]" />
                  </div>
                )}
              </button>

              {/* Content — tappable area */}
              <div className="flex-1 min-w-0 py-1" onClick={() => onHabitDetail(habit)}>
                <p className={`font-semibold text-[14px] truncate ${done ? 'line-through text-white/15' : 'text-white/90'}`}>
                  {habit.name}
                </p>
                <div className="flex items-center gap-2.5 mt-0.5">
                  {streak > 0 && (
                    <span className={`flex items-center gap-[2px] text-[11px] font-black ${streak >= 7 ? 'text-[var(--color-brand)]' : 'text-amber-400/70'}`}>
                      <Flame size={10} className={isJustDone ? 'animate-streak-fire' : ''} />
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

              {primary && (
                <ProgressRing
                  percentage={primary.percentage}
                  size={40}
                  strokeWidth={3}
                  color={habit.color}
                  showLabel={false}
                  glow={done}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* FAB — fixed to bottom-right, respects safe area */}
      <button
        onClick={onAddHabit}
        className="fixed bottom-[calc(80px+var(--safe-bottom))] right-4 w-12 h-12 bg-[var(--color-brand)] rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-[0_4px_20px_rgba(var(--color-brand-rgb),0.3)] z-30"
      >
        <Plus size={22} className="text-white" strokeWidth={2.5} />
      </button>
    </div>
  )
}
