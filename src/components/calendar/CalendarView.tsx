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

  const completionMap = useMemo(
    () => getCompletionsForMonth(completions, viewMonth),
    [completions, viewMonth]
  )

  const habitColorMap = useMemo(() => {
    const m = new Map<string, string>()
    habits.forEach(h => m.set(h.id, h.color))
    return m
  }, [habits])

  function prevMonth() {
    const d = new Date(year, month - 2, 1)
    setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  function nextMonth() {
    const d = new Date(year, month, 1)
    setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const monthLabel = new Date(year, month - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="px-4 pb-28">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] active:scale-90 transition-all">
          <ChevronLeft size={16} className="text-white/50" />
        </button>
        <span className="font-heading text-lg tracking-wide">{monthLabel.toUpperCase()}</span>
        <button onClick={nextMonth} className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] active:scale-90 transition-all">
          <ChevronRight size={16} className="text-white/50" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] font-semibold text-white/20 uppercase">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${viewMonth}-${String(day).padStart(2, '0')}`
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate
          const dayCompletions = completionMap[dateStr] || []
          const hasActivity = dayCompletions.length > 0

          return (
            <button
              key={day}
              onClick={() => onDaySelect(dateStr)}
              className={`relative flex flex-col items-center justify-center h-11 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : isToday
                    ? 'bg-brand/10 text-brand font-bold border border-brand/20'
                    : hasActivity
                      ? 'bg-white/[0.04] text-white/70'
                      : 'text-white/30 hover:bg-white/[0.03]'
              }`}
            >
              {day}
              {hasActivity && !isSelected && (
                <div className="absolute bottom-1 flex gap-[3px]">
                  {dayCompletions.slice(0, 3).map(hid => (
                    <div
                      key={hid}
                      className="w-[4px] h-[4px] rounded-full"
                      style={{ backgroundColor: habitColorMap.get(hid) || 'var(--color-brand)' }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Day detail */}
      {selectedDate && (
        <div className="mt-5 p-4 bg-[#1a1a1a] rounded-2xl border border-white/[0.04]">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">
            {selectedDate === today ? 'Today' : new Date(selectedDate + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          {(completionMap[selectedDate] || []).length === 0 ? (
            <p className="text-sm text-white/20 italic">No activity</p>
          ) : (
            <div className="space-y-2">
              {(completionMap[selectedDate] || []).map(hid => {
                const habit = habits.find(h => h.id === hid)
                if (!habit) return null
                return (
                  <div key={hid} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: habit.color + '20' }}>
                      <Check size={14} style={{ color: habit.color }} />
                    </div>
                    <span className="text-sm font-medium text-white/70">{habit.name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
