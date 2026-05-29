import { Home, Calendar, BarChart3, Settings } from 'lucide-react'
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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0d0d0d]/95 backdrop-blur-sm border-t border-white/5 z-40">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition ${
              activeTab === id ? 'text-[var(--color-brand)]' : 'text-[#e8e4dc]/50 hover:text-[#e8e4dc]/80'
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
