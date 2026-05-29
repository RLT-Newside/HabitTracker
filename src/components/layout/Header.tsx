import { Settings, Zap } from 'lucide-react'

interface HeaderProps {
  onSettingsOpen: () => void
  streak: number
}

export function Header({ onSettingsOpen, streak }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4 sticky top-0 z-30 glass border-b border-white/[0.03]">
      <div className="flex items-center gap-2">
        <h1 className="font-heading text-[28px] tracking-wider text-white">JHABITS</h1>
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20">
            <Zap size={12} className="text-[var(--color-brand)]" fill="currentColor" />
            <span className="text-[11px] font-bold text-[var(--color-brand)]">{streak}</span>
          </div>
        )}
      </div>
      <button onClick={onSettingsOpen} className="p-2.5 rounded-xl hover:bg-white/[0.04] active:scale-90 transition-all">
        <Settings size={18} className="text-white/40" />
      </button>
    </header>
  )
}
