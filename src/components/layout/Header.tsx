import { Settings } from 'lucide-react'

interface HeaderProps {
  onSettingsOpen: () => void
}

export function Header({ onSettingsOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/[0.03]">
      <h1 className="font-heading text-[26px] tracking-wide text-brand">JHabits</h1>
      <button onClick={onSettingsOpen} className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] active:scale-95 transition-all">
        <Settings size={18} className="text-white/50" />
      </button>
    </header>
  )
}
