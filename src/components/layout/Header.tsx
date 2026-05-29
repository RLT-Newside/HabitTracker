import { Settings, Zap } from 'lucide-react'

interface HeaderProps {
  onSettingsOpen: () => void
  streak: number
}

export function Header({ onSettingsOpen, streak }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 h-14 sticky top-0 z-30 glass border-b border-white/[0.03]">
      <div className="flex items-center gap-2">
        <h1 className="font-heading text-[26px] tracking-wider text-white">JHABITS</h1>
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20">
            <Zap size={11} className="text-[var(--color-brand)]" fill="currentColor" />
            <span className="text-[11px] font-bold text-[var(--color-brand)]">{streak}</span>
          </div>
        )}
      </div>
      <button onClick={onSettingsOpen} className="w-10 h-10 flex items-center justify-center rounded-xl active:scale-90 active:bg-white/[0.06] transition-all">
        <Settings size={18} className="text-white/40" />
      </button>
    </header>
  )
}
