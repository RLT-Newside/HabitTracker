import { Home, Calendar, BarChart3 } from 'lucide-react'
import { Tab } from '../../types'

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Today' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'stats', icon: BarChart3, label: 'Stats' },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40" style={{ paddingBottom: 'max(12px, var(--safe-bottom))' }}>
      <div className="mx-3 flex justify-around items-center h-14 rounded-2xl glass border border-white/[0.05] shadow-[0_-2px_20px_rgba(0,0,0,0.4)]">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center gap-0.5 w-20 h-12 justify-center rounded-xl transition-colors ${
                active ? 'text-[var(--color-brand)]' : 'text-white/25 active:text-white/40'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-[var(--color-brand)]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
