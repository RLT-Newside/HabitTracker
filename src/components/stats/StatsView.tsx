import { Flame, Trophy, Target } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center pt-40 px-8 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center">
          <Target size={28} className="text-white/15" />
        </div>
        <p className="font-heading text-xl text-white/30">NO STATS YET</p>
        <p className="text-xs text-white/15 text-center">Create habits and start tracking to see statistics</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-28 space-y-3">
      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">All Habits</p>

      {activeHabits.map(habit => {
        const progress = calculateGoalProgress(habit, completions)
        const streak = getStreakInfo(completions, habit.id)
        const primary = progress[0]

        return (
          <div key={habit.id} className="p-4 bg-[#1a1a1a] rounded-2xl border border-white/[0.04] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-[15px] text-white/90">{habit.name}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400/80">
                    <Flame size={11} />{streak.current}d
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-white/20">
                    <Trophy size={10} />{streak.longest}d best
                  </span>
                </div>
              </div>
              {primary && (
                <ProgressRing percentage={primary.percentage} size={58} strokeWidth={4.5} color={habit.color} />
              )}
            </div>

            {progress.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {progress.map(gp => (
                  <div key={gp.goalId} className="p-2.5 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">
                        {FREQUENCY_LABELS[gp.frequency]}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        gp.onTrack
                          ? 'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400/80 border border-red-500/20'
                      }`}>
                        {gp.onTrack ? 'On Track' : 'Behind'}
                      </span>
                    </div>
                    <p className="font-heading text-xl">
                      {gp.currentCount}<span className="text-white/20">/{gp.targetCount}</span>
                    </p>
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
