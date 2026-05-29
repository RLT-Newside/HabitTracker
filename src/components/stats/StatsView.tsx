import { Flame, Trophy, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { Habit, Completion, FREQUENCY_LABELS } from '../../types'
import { calculateGoalProgress, getStreakInfo, getCurrentStreak } from '../../hooks/useStats'
import { ProgressRing } from '../shared/ProgressRing'

interface StatsViewProps {
  habits: Habit[]
  completions: Completion[]
}

export function StatsView({ habits, completions }: StatsViewProps) {
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits])

  const stats = useMemo(() => {
    return activeHabits.map(h => ({
      habit: h,
      progress: calculateGoalProgress(h, completions),
      streak: getStreakInfo(completions, h.id),
    }))
  }, [activeHabits, completions])

  const globalStats = useMemo(() => ({
    total: completions.length,
    currentBest: Math.max(...activeHabits.map(h => getCurrentStreak(completions, h.id)), 0),
    longestEver: Math.max(...stats.map(s => s.streak.longest), 0),
  }), [stats, completions, activeHabits])

  if (activeHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70dvh] px-8 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
          <TrendingUp size={28} className="text-white/10" />
        </div>
        <p className="font-heading text-xl tracking-wider text-white/25">NO DATA YET</p>
        <p className="text-[12px] text-white/15 text-center">Start tracking habits to see statistics</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24 space-y-3 animate-fade-in">
      {/* Global stats */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        <div className="card p-3 text-center">
          <p className="font-heading text-[22px] leading-none text-[var(--color-brand)]">{globalStats.total}</p>
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Total</p>
        </div>
        <div className="card p-3 text-center">
          <p className="font-heading text-[22px] leading-none text-[var(--color-brand)]">{globalStats.currentBest}d</p>
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Streak</p>
        </div>
        <div className="card p-3 text-center">
          <p className="font-heading text-[22px] leading-none">{globalStats.longestEver}d</p>
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-wider mt-1">Best</p>
        </div>
      </div>

      <h2 className="font-heading text-[12px] tracking-[0.12em] text-white/20 pt-1 pl-0.5">PER HABIT</h2>

      {stats.map(({ habit, progress, streak }) => {
        const primary = progress[0]
        return (
          <div key={habit.id} className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
                  <p className="font-semibold text-[14px] text-white/90 truncate">{habit.name}</p>
                </div>
                <div className="flex items-center gap-3 mt-1.5 pl-4">
                  <span className="flex items-center gap-1 text-[11px] font-black text-amber-400/80">
                    <Flame size={11} />{streak.current}d
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-white/15">
                    <Trophy size={10} />{streak.longest}d
                  </span>
                </div>
              </div>
              {primary && (
                <ProgressRing percentage={primary.percentage} size={56} strokeWidth={4} color={habit.color} glow />
              )}
            </div>

            {progress.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {progress.map(gp => (
                  <div key={gp.goalId} className="p-2.5 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-wider">
                        {FREQUENCY_LABELS[gp.frequency]}
                      </span>
                      <span className={`text-[8px] px-1.5 py-[1px] rounded-full font-bold uppercase ${
                        gp.onTrack
                          ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/15'
                          : 'bg-red-500/8 text-red-400/80 border border-red-500/15'
                      }`}>
                        {gp.onTrack ? 'On Track' : 'Behind'}
                      </span>
                    </div>
                    <div className="flex items-end gap-0.5">
                      <span className="font-heading text-[20px] leading-none">{gp.currentCount}</span>
                      <span className="text-white/15 font-heading text-[14px] leading-none mb-[1px]">/{gp.targetCount}</span>
                    </div>
                    <div className="mt-1.5 h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${gp.percentage}%`, backgroundColor: habit.color }}
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
