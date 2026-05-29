import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Habit, Completion } from '../../types'
import { getCompletionsForMonth, getToday } from '../../hooks/useStats'

interface CalendarViewProps {
  habits: Habit[]
  completions: Completion[]
  onDaySelect: (date: string) => void
  selectedDate: string
}

export function CalendarView({ habits, completions, onDaySelect, selectedDate }: CalendarViewProps) {
  const today = getToday()
  const [viewMonth, setViewMonth] = useState(today.slice(0, 7))

  const year = parseInt(viewMonth.slice(0, 4))
  const month = parseInt(viewMonth.slice(5, 7))
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const completionMap = useMemo(() => getCompletionsForMonth(completions, viewMonth), [completions, viewMonth])
  const habitMap = useMemo(() => new Map(habits.map(h => [h.id, h])), [habits])

  function prevMonth() {
    const d = new Date(year, month - 2, 1)
    setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  function nextMonth() {
    const d = new Date(year, month, 1)
    setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const monthLabel = new Date(year, month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const selectedCompletions = completionMap[selectedDate] || []

  return (
    <div className="px-4 pb-24 animate-fade-in">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4 mt-1">
        <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl active:scale-90 active:bg-white/[0.04] transition-all">
          <ChevronLeft size={18} className="text-white/40" />
        </button>
        <span className="font-heading text-[16px] tracking-[0.12em] text-white/80">{monthLabel.toUpperCase()}</span>
        <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl active:scale-90 active:bg-white/[0.04] transition-all">
          <ChevronRight size={18} className="text-white/40" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center mb-1.5">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] font-bold text-white/15 uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Day grid — each cell is at least 44px tall for touch */}
      <div className="grid grid-cols-7 gap-[3px]">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${viewMonth}-${String(day).padStart(2, '0')}`
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate
          const dayHabits = completionMap[dateStr] || []
          const hasActivity = dayHabits.length > 0

          return (
            <button
              key={day}
              onClick={() => onDaySelect(dateStr)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] rounded-xl text-[13px] font-medium transition-colors ${
                isSelected
                  ? 'bg-[var(--color-brand)] text-white font-bold'
                  : isToday
                    ? 'bg-[var(--color-brand)]/8 text-[var(--color-brand)] font-bold ring-1 ring-inset ring-[var(--color-brand)]/20'
                    : hasActivity
                      ? 'bg-white/[0.03] text-white/60 active:bg-white/[0.06]'
                      : 'text-white/25 active:bg-white/[0.03]'
              }`}
            >
              {day}
              {hasActivity && !isSelected && (
                <div className="absolute bottom-[4px] flex gap-[2px]">
                  {dayHabits.slice(0, 3).map(hid => (
                    <div key={hid} className="w-1 h-1 rounded-full" style={{ backgroundColor: habitMap.get(hid)?.color || 'var(--color-brand)' }} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Day detail */}
      <div className="mt-4 card p-4 animate-slide-up">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-2.5">
          {selectedDate === today ? 'Today' : new Date(selectedDate + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
        {selectedCompletions.length === 0 ? (
          <p className="text-[13px] text-white/15">No activity recorded</p>
        ) : (
          <div className="space-y-2">
            {selectedCompletions.map(hid => {
              const habit = habitMap.get(hid)
              if (!habit) return null
              return (
                <div key={hid} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: habit.color + '15' }}>
                    <Check size={13} style={{ color: habit.color }} strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-medium text-white/70">{habit.name}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
