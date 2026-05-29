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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-4 pb-4">
      <div className="flex justify-around items-center h-[56px] rounded-2xl glass border border-white/[0.05] shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center gap-[3px] px-6 py-2 rounded-xl transition-all duration-200 ${
                active ? 'text-[var(--color-brand)]' : 'text-white/25 hover:text-white/40 active:scale-90'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold uppercase tracking-[0.1em]">{label}</span>
              {active && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
