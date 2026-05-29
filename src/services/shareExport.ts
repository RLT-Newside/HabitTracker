import { Share } from '@capacitor/share'
import { Capacitor } from '@capacitor/core'
import { Habit, Completion, Task } from '../types'

export async function exportData(habits: Habit[], completions: Completion[], tasks: Task[]) {
  const payload = JSON.stringify({ habits, completions, tasks, exportedAt: new Date().toISOString() }, null, 2)

  if (Capacitor.isNativePlatform()) {
    await Share.share({
      title: 'JHabits Backup',
      text: payload,
      dialogTitle: 'Export JHabits Data',
    })
  } else {
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jhabits-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

export async function importData(): Promise<{ habits: Habit[]; completions: Completion[]; tasks: Task[] } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) { resolve(null); return }
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (data.habits && data.completions) {
          resolve({ habits: data.habits, completions: data.completions, tasks: data.tasks || [] })
        } else {
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    }
    input.click()
  })
}
