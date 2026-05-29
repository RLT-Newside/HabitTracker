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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40">
      <div className="mx-3 mb-3 flex justify-around items-center h-14 rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/[0.04] shadow-2xl shadow-black/40">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`relative flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all ${
              activeTab === id
                ? 'text-brand'
                : 'text-white/30 hover:text-white/50 active:scale-95'
            }`}
          >
            <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 1.5} />
            <span className="text-[9px] font-semibold uppercase tracking-wider">{label}</span>
            {activeTab === id && (
              <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-brand" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
