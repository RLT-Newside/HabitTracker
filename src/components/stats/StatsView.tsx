import { Flame, Trophy } from 'lucide-react'
import { Habit, Completion, FREQUENCY_LABELS } from '../../types'
import { calculateGoalProgress, getStreakInfo } from '../../hooks/useStats'
import { ProgressRing } from '../shared/ProgressRing'

interface StatsViewProps {
  habits: Habit[]
  completions: Completion[]
}

export function StatsView({ habits, completions }: StatsViewProps) {
  const activeHabits = habits.filter(h => !h.archived)

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 text-white/30 px-4">
        <p className="text-lg">No stats yet</p>
        <p className="text-sm mt-1">Create habits to see statistics</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24 space-y-3">
      {activeHabits.map(habit => {
        const progress = calculateGoalProgress(habit, completions)
        const streak = getStreakInfo(completions, habit.id)
        const primary = progress[0]

        return (
          <div key={habit.id} className="p-4 bg-white/5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{habit.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Flame size={12} />{streak.current}d
                  </span>
                  <span className="flex items-center gap-1 text-xs text-yellow-300/60">
                    <Trophy size={12} />{streak.longest}d best
                  </span>
                </div>
              </div>
              {primary && (
                <ProgressRing percentage={primary.percentage} size={56} strokeWidth={4} color={habit.color} />
              )}
            </div>

            {progress.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {progress.map(gp => (
                  <div key={gp.goalId} className="p-2 bg-white/3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">{FREQUENCY_LABELS[gp.frequency]}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${gp.onTrack ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {gp.onTrack ? 'On Track' : 'Behind'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mt-0.5">{gp.currentCount}/{gp.targetCount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
