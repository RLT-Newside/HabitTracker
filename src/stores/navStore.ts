import { create } from 'zustand'
import { Tab } from '../types'

interface NavStore {
  tab: Tab
  history: Tab[]
  selectedDate: string
  settingsOpen: boolean
  habitFormOpen: boolean
  editHabitId: string | null

  setTab: (tab: Tab) => void
  goBack: () => boolean
  setSelectedDate: (date: string) => void
  openSettings: () => void
  closeSettings: () => void
  openHabitForm: (editId?: string) => void
  closeHabitForm: () => void
}

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useNavStore = create<NavStore>((set, get) => ({
  tab: 'dashboard',
  history: [],
  selectedDate: todayISO(),
  settingsOpen: false,
  habitFormOpen: false,
  editHabitId: null,

  setTab: (tab) => {
    const current = get().tab
    if (current !== tab) {
      set({ tab, history: [...get().history, current] })
    }
  },

  goBack: () => {
    const { settingsOpen, habitFormOpen, history } = get()
    if (settingsOpen) { set({ settingsOpen: false }); return true }
    if (habitFormOpen) { set({ habitFormOpen: false, editHabitId: null }); return true }
    if (history.length > 0) {
      const prev = history[history.length - 1]
      set({ tab: prev, history: history.slice(0, -1) })
      return true
    }
    return false
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  openHabitForm: (editId) => set({ habitFormOpen: true, editHabitId: editId || null }),
  closeHabitForm: () => set({ habitFormOpen: false, editHabitId: null }),
}))
