import { Download, Upload } from 'lucide-react'
import { Modal } from '../shared/Modal'
import { Habit, Completion, Task } from '../../types'
import { Theme, THEME_META } from '../../hooks/useTheme'
import { exportData, importData } from '../../services/shareExport'

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

export function SettingsModal({ open, onClose, theme, setTheme, habits, completions, tasks, onImport }: SettingsModalProps) {
  async function handleExport() {
    await exportData(habits, completions, tasks)
  }

  async function handleImport() {
    const data = await importData()
    if (data) {
      onImport(data)
      alert('Data imported successfully!')
    } else {
      alert('Invalid or no file selected.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="SETTINGS">
      <div className="space-y-8">
        {/* Theme */}
        <div>
          <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Accent Color</label>
          <div className="flex gap-3.5 mt-4">
            {(Object.keys(THEME_META) as Theme[]).map(t => {
              const meta = THEME_META[t]
              const active = theme === t
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                      active
                        ? 'scale-[1.2] ring-[2px] ring-white/70 ring-offset-[3px] ring-offset-[#131315]'
                        : 'opacity-40 hover:opacity-70 hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: meta.color,
                      boxShadow: active ? `0 6px 24px ${meta.color}40` : undefined,
                    }}
                  />
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${active ? 'text-white/60' : 'text-white/15'}`}>
                    {meta.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Data */}
        <div className="space-y-2.5">
          <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Data</label>
          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-4 card card-hover">
            <Download size={16} className="text-[var(--color-brand)]" />
            <div className="text-left">
              <span className="text-[13px] font-semibold text-white/70">Export Backup</span>
              <p className="text-[10px] text-white/20 mt-0.5">{habits.length} habits, {completions.length} completions</p>
            </div>
          </button>
          <button onClick={handleImport} className="w-full flex items-center gap-3 px-4 py-4 card card-hover">
            <Upload size={16} className="text-[var(--color-brand)]" />
            <span className="text-[13px] font-semibold text-white/70">Import Backup</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.03] text-center space-y-2">
          <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">JHabits v{__APP_VERSION__}</p>
          <p className="text-[11px] text-white/8">Build better habits, one day at a time.</p>
        </div>
      </div>
    </Modal>
  )
}
