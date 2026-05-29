import { Download, Upload, Trash2 } from 'lucide-react'
import { Modal } from '../shared/Modal'
import { Habit, Completion, Task } from '../../types'
import { Theme } from '../../hooks/useTheme'

declare const __APP_VERSION__: string

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  theme: Theme
  setTheme: (theme: Theme) => void
  habits: Habit[]
  completions: Completion[]
  tasks: Task[]
  onImport: (data: { habits: Habit[]; completions: Completion[]; tasks: Task[] }) => void
}

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: 'amber', label: 'Amber', color: '#d97706' },
  { id: 'green', label: 'Green', color: '#059669' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'purple', label: 'Purple', color: '#8b5cf6' },
]

export function SettingsModal({ open, onClose, theme, setTheme, habits, completions, tasks, onImport }: SettingsModalProps) {
  function handleExport() {
    const data = JSON.stringify({ habits, completions, tasks, exportedAt: new Date().toISOString() }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jhabits-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (data.habits && data.completions) {
          onImport(data)
          alert('Data imported successfully!')
        }
      } catch {
        alert('Invalid backup file.')
      }
    }
    input.click()
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="space-y-6">
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Theme</label>
          <div className="flex gap-3 mt-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-10 h-10 rounded-full transition-all ${theme === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a] scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: t.color }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Data</label>
          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/8 transition">
            <Download size={18} className="text-[var(--color-brand)]" />
            <span className="text-sm">Export Backup (JSON)</span>
          </button>
          <button onClick={handleImport} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/8 transition">
            <Upload size={18} className="text-[var(--color-brand)]" />
            <span className="text-sm">Import Backup</span>
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-white/20">JHabits v{__APP_VERSION__}</p>
          <p className="text-xs text-white/20 mt-0.5">Build better habits, one day at a time.</p>
        </div>
      </div>
    </Modal>
  )
}
