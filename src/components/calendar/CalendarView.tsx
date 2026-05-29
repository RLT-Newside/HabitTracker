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
    <div className="px-5 pb-28 animate-fade-in">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5 mt-1">
        <button onClick={prevMonth} className="p-2.5 rounded-xl hover:bg-white/[0.04] active:scale-90 transition-all">
          <ChevronLeft size={16} className="text-white/40" />
        </button>
        <span className="font-heading text-[17px] tracking-[0.15em] text-white/80">{monthLabel.toUpperCase()}</span>
        <button onClick={nextMonth} className="p-2.5 rounded-xl hover:bg-white/[0.04] active:scale-90 transition-all">
          <ChevronRight size={16} className="text-white/40" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-[9px] font-bold text-white/15 uppercase tracking-wider">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-[5px]">
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
              className={`relative flex flex-col items-center justify-center h-[44px] rounded-xl text-[13px] font-medium transition-all duration-150 ${
                isSelected
                  ? 'bg-[var(--color-brand)] text-white font-bold shadow-[0_4px_16px_rgba(var(--color-brand-rgb),0.3)]'
                  : isToday
                    ? 'bg-[var(--color-brand)]/8 text-[var(--color-brand)] font-bold ring-1 ring-[var(--color-brand)]/20'
                    : hasActivity
                      ? 'bg-white/[0.03] text-white/60'
                      : 'text-white/25 hover:bg-white/[0.02]'
              }`}
            >
              {day}
              {hasActivity && !isSelected && (
                <div className="absolute bottom-[5px] flex gap-[2px]">
                  {dayHabits.slice(0, 3).map(hid => (
                    <div
                      key={hid}
                      className="w-[3px] h-[3px] rounded-full"
                      style={{ backgroundColor: habitMap.get(hid)?.color || 'var(--color-brand)' }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Day detail */}
      <div className="mt-5 card p-4 animate-slide-up">
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3">
          {selectedDate === today ? 'Today' : new Date(selectedDate + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
        {selectedCompletions.length === 0 ? (
          <p className="text-[13px] text-white/15 italic">No activity recorded</p>
        ) : (
          <div className="space-y-2">
            {selectedCompletions.map(hid => {
              const habit = habitMap.get(hid)
              if (!habit) return null
              return (
                <div key={hid} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: habit.color + '15' }}>
                    <Check size={14} style={{ color: habit.color }} strokeWidth={3} />
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
