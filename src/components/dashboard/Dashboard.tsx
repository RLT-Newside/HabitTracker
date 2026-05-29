import { useCallback } from 'react'
import { Plus, Flame, Check, Circle } from 'lucide-react'
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
  const pct = activeHabits.length > 0 ? Math.round((completedCount / activeHabits.length) * 100) : 0

  return (
    <div className="px-4 pb-24 space-y-4">
      {activeHabits.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-white/40">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-brand)] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-white/40">{completedCount}/{activeHabits.length} completed</p>
        </div>
      )}

      {activeHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-32 gap-4 text-white/30">
          <Plus size={48} />
          <p className="text-lg">No habits yet</p>
          <button onClick={onAddHabit} className="px-6 py-2.5 bg-[var(--color-brand)] text-white rounded-xl font-semibold">
            Create First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {activeHabits.map(habit => {
            const done = isTodayCompleted(completions, habit.id)
            const streak = getCurrentStreak(completions, habit.id)
            const progress = calculateGoalProgress(habit, completions)
            const primary = progress[0]

            return (
              <div
                key={habit.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl transition-all ${done ? 'bg-white/3' : 'bg-white/5 hover:bg-white/8'}`}
              >
                <button
                  onClick={() => onToggle(habit.id)}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {done ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: habit.color }}>
                      <Check size={18} className="text-white" />
                    </div>
                  ) : (
                    <Circle size={32} className="text-white/20" />
                  )}
                </button>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onHabitDetail(habit)}>
                  <p className={`font-medium truncate ${done ? 'line-through text-white/30' : ''}`}>{habit.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {streak > 0 && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-400">
                        <Flame size={12} />{streak}d
                      </span>
                    )}
                    {primary && (
                      <span className="text-xs text-white/30">
                        {primary.currentCount}/{primary.targetCount} {FREQUENCY_LABELS[primary.frequency].toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>

                {primary && (
                  <ProgressRing percentage={primary.percentage} size={40} strokeWidth={3} color={habit.color} showLabel={false} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {activeHabits.length > 0 && (
        <button
          onClick={onAddHabit}
          className="fixed bottom-20 right-4 w-14 h-14 bg-[var(--color-brand)] rounded-full flex items-center justify-center shadow-lg shadow-[var(--color-brand)]/20 active:scale-95 transition z-30"
          style={{ right: 'max(16px, calc(50% - 215px + 16px))' }}
        >
          <Plus size={24} className="text-white" />
        </button>
      )}
    </div>
  )
}
