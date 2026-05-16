import { useEffect, useRef } from 'react'

function msUntil(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  return target - now
}

export function useSupplementReminders(supplements) {
  const timersRef = useRef([])

  useEffect(() => {
    if (!('Notification' in window)) return

    Notification.requestPermission()

    // Clear previous timers before scheduling new ones
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    supplements.forEach((s) => {
      if (s.taken) return
      const delay = msUntil(s.time)
      const id = setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('JHabits Reminder', {
            body: `Time for ${s.name} — ${s.dose}`,
            icon: '/favicon.ico',
          })
        }
      }, delay)
      timersRef.current.push(id)
    })

    return () => timersRef.current.forEach(clearTimeout)
  }, [supplements])
}
