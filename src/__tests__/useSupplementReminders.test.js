import { renderHook } from '@testing-library/react'
import { useSupplementReminders } from '../hooks/useSupplementReminders.js'

// Mock Notification API
beforeEach(() => {
  vi.useFakeTimers()
  global.Notification = vi.fn()
  global.Notification.permission = 'granted'
  global.Notification.requestPermission = vi.fn().mockResolvedValue('granted')
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const supps = [
  { id: 1, name: 'Creatine', dose: '5g', time: '08:00', taken: false },
]

describe('useSupplementReminders', () => {
  it('requests Notification permission on mount', () => {
    renderHook(() => useSupplementReminders(supps))
    expect(Notification.requestPermission).toHaveBeenCalled()
  })

  it('fires a Notification for untaken supplement at its time', () => {
    // Set fake "now" to exactly 08:00
    const date = new Date()
    date.setHours(8, 0, 0, 0)
    vi.setSystemTime(date)

    renderHook(() => useSupplementReminders(supps))
    vi.runAllTimers()

    expect(Notification).toHaveBeenCalledWith('JHabits Reminder', expect.objectContaining({
      body: expect.stringContaining('Creatine'),
    }))
  })

  it('does not fire Notification for already-taken supplement', () => {
    const takenSupps = [{ ...supps[0], taken: true }]
    const date = new Date()
    date.setHours(8, 0, 0, 0)
    vi.setSystemTime(date)

    renderHook(() => useSupplementReminders(takenSupps))
    vi.runAllTimers()

    expect(Notification).not.toHaveBeenCalled()
  })
})
