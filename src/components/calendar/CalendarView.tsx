import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    <div className="px-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/5"><ChevronLeft size={20} /></button>
        <span className="font-semibold">{monthLabel}</span>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/5"><ChevronRight size={20} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/30 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${viewMonth}-${String(day).padStart(2, '0')}`
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate
          const dayCompletions = completionMap[dateStr] || []

          return (
            <button
              key={day}
              onClick={() => onDaySelect(dateStr)}
              className={`relative flex flex-col items-center justify-center h-10 rounded-lg transition text-sm ${
                isSelected ? 'bg-[var(--color-brand)] text-white font-bold' :
                isToday ? 'bg-white/8 text-[var(--color-brand)] font-bold' :
                'hover:bg-white/5'
              }`}
            >
              {day}
              {dayCompletions.length > 0 && (
                <div className="flex gap-0.5 absolute bottom-1">
                  {dayCompletions.slice(0, 3).map(hid => (
                    <div key={hid} className="w-1 h-1 rounded-full" style={{ backgroundColor: habitColorMap.get(hid) || 'var(--color-brand)' }} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 p-3 bg-white/5 rounded-xl">
          <p className="text-sm font-medium mb-2">{selectedDate === today ? 'Today' : selectedDate}</p>
          {(completionMap[selectedDate] || []).length === 0 ? (
            <p className="text-xs text-white/30">No completions</p>
          ) : (
            <div className="space-y-1.5">
              {(completionMap[selectedDate] || []).map(hid => {
                const habit = habits.find(h => h.id === hid)
                if (!habit) return null
                return (
                  <div key={hid} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                    <span>{habit.name}</span>
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
