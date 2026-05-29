import { Settings } from 'lucide-react'

interface HeaderProps {
  onSettingsOpen: () => void
}

export function Header({ onSettingsOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur-sm">
      <h1 className="font-['Bebas_Neue'] text-2xl tracking-wide text-[var(--color-brand)]">JHabits</h1>
      <button onClick={onSettingsOpen} className="p-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition">
        <Settings size={20} className="text-[#e8e4dc]" />
      </button>
    </header>
  )
}
