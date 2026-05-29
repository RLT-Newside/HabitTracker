import { Download, Upload } from 'lucide-react'
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
    <Modal open={open} onClose={onClose} title="SETTINGS">
      <div className="space-y-7">
        <div>
          <label className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Theme Color</label>
          <div className="flex gap-3 mt-3">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                  theme === t.id
                    ? 'scale-125 ring-2 ring-white/70 ring-offset-2 ring-offset-[#141414] shadow-lg'
                    : 'hover:scale-110 opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.color, boxShadow: theme === t.id ? `0 4px 16px ${t.color}40` : undefined }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Data Management</label>
          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04] hover:bg-white/[0.05] active:scale-[0.98] transition-all">
            <Download size={16} className="text-brand" />
            <span className="text-sm font-medium text-white/60">Export Backup</span>
          </button>
          <button onClick={handleImport} className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04] hover:bg-white/[0.05] active:scale-[0.98] transition-all">
            <Upload size={16} className="text-brand" />
            <span className="text-sm font-medium text-white/60">Import Backup</span>
          </button>
        </div>

        <div className="pt-5 border-t border-white/[0.03] text-center space-y-1">
          <p className="text-[10px] text-white/15 font-medium uppercase tracking-widest">JHabits v{__APP_VERSION__}</p>
          <p className="text-[11px] text-white/10">Build better habits, one day at a time.</p>
        </div>
      </div>
    </Modal>
  )
}
