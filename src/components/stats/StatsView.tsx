import { Flame, Trophy, Target, TrendingUp } from 'lucide-react'
import { Habit, Completion, FREQUENCY_LABELS } from '../../types'
import { calculateGoalProgress, getStreakInfo, getCurrentStreak } from '../../hooks/useStats'
import { ProgressRing } from '../shared/ProgressRing'

interface StatsViewProps {
  habits: Habit[]
  completions: Completion[]
}

export function StatsView({ habits, completions }: StatsViewProps) {
  const activeHabits = habits.filter(h => !h.archived)

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-36 px-8 gap-5 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
          <TrendingUp size={32} className="text-white/10" />
        </div>
        <p className="font-heading text-2xl tracking-wider text-white/25">NO DATA YET</p>
        <p className="text-xs text-white/15 text-center">Start tracking habits to see your statistics</p>
      </div>
    )
  }

  const totalCompletions = completions.length
  const bestOverallStreak = Math.max(...activeHabits.map(h => getStreakInfo(completions, h.id).longest), 0)
  const currentBestStreak = Math.max(...activeHabits.map(h => getCurrentStreak(completions, h.id)), 0)

  return (
    <div className="px-5 pb-28 space-y-4 animate-fade-in">
      {/* Global stats */}
      <div className="grid grid-cols-3 gap-2.5 mt-1">
        <div className="card p-3.5 text-center">
          <p className="font-heading text-[24px] text-[var(--color-brand)]">{totalCompletions}</p>
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">Total</p>
        </div>
        <div className="card p-3.5 text-center">
          <p className="font-heading text-[24px] text-[var(--color-brand)]">{currentBestStreak}d</p>
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">Streak</p>
        </div>
        <div className="card p-3.5 text-center">
          <p className="font-heading text-[24px]">{bestOverallStreak}d</p>
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">Best Ever</p>
        </div>
      </div>

      <h2 className="font-heading text-[14px] tracking-[0.15em] text-white/25 pt-2">PER HABIT</h2>

      {activeHabits.map(habit => {
        const progress = calculateGoalProgress(habit, completions)
        const streak = getStreakInfo(completions, habit.id)
        const primary = progress[0]

        return (
          <div key={habit.id} className="card p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: habit.color }} />
                  <p className="font-bold text-[15px] text-white/90 truncate">{habit.name}</p>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-[11px] font-black text-amber-400/80">
                    <Flame size={12} />{streak.current}d
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-white/15">
                    <Trophy size={10} />{streak.longest}d best
                  </span>
                </div>
              </div>
              {primary && (
                <ProgressRing percentage={primary.percentage} size={60} strokeWidth={5} color={habit.color} glow />
              )}
            </div>

            {/* Goal cards */}
            {progress.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {progress.map(gp => (
                  <div key={gp.goalId} className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.15em]">
                        {FREQUENCY_LABELS[gp.frequency]}
                      </span>
                      <span className={`text-[8px] px-2 py-[2px] rounded-full font-black uppercase tracking-wider ${
                        gp.onTrack
                          ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/15'
                          : 'bg-red-500/8 text-red-400/80 border border-red-500/15'
                      }`}>
                        {gp.onTrack ? 'On Track' : 'Behind'}
                      </span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="font-heading text-[22px] leading-none">{gp.currentCount}</span>
                      <span className="text-white/15 font-heading text-[16px] leading-none mb-[1px]">/{gp.targetCount}</span>
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-2 h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${gp.percentage}%`,
                          backgroundColor: habit.color,
                          boxShadow: `0 0 6px ${habit.color}40`,
                        }}
                      />
                    </div>
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
