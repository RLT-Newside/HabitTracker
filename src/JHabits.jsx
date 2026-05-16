import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { PALETTE, NAV_ITEMS, DEFAULT_HABITS, DEFAULT_SUPPLEMENTS, DEFAULT_STORE_ITEMS, DEFAULT_CALENDAR_EVENTS, COINS_INITIAL, RC4_APP_KEY, XP_INITIAL, XP_NEXT, LEVEL } from './constants.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useSupplementReminders } from './hooks/useSupplementReminders.js'

// Lazy-load each tab — only parsed when first visited
const HabitsTab    = lazy(() => import('./components/tabs/HabitsTab.jsx'))
const StatsTab     = lazy(() => import('./components/tabs/StatsTab.jsx'))
const LessonsTab   = lazy(() => import('./components/tabs/LessonsTab.jsx'))
const CharacterTab = lazy(() => import('./components/tabs/CharacterTab.jsx'))
const CalendarTab  = lazy(() => import('./components/tabs/CalendarTab.jsx'))

function TabFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: PALETTE.muted, fontSize: 13 }}>
      Loading…
    </div>
  )
}

export default function JHabits() {
  const [tab, setTab] = useState('habits')

  // Encrypted persistent state
  const [habits, setHabits]   = useLocalStorage('jh_habits', DEFAULT_HABITS, RC4_APP_KEY)
  const [supps, setSupps]     = useLocalStorage('jh_supps', DEFAULT_SUPPLEMENTS, RC4_APP_KEY)
  const [coins, setCoins]     = useLocalStorage('jh_coins', COINS_INITIAL, RC4_APP_KEY)
  const [store, setStore]     = useLocalStorage('jh_store', DEFAULT_STORE_ITEMS, RC4_APP_KEY)
  const [owned, setOwned]     = useLocalStorage('jh_owned', DEFAULT_STORE_ITEMS.filter(x => x.owned).map(x => x.id), RC4_APP_KEY)
  const [events, setEvents]   = useLocalStorage('jh_events', DEFAULT_CALENDAR_EVENTS, RC4_APP_KEY)

  // Supplement reminders via Notification API
  useSupplementReminders(supps)

  // useRef: scroll container — reset to top on tab change
  const scrollRef = useRef(null)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [tab])

  // useRef: XP counter animation
  const [displayedXP, setDisplayedXP] = useState(0)
  const xpIntervalRef = useRef(null)
  useEffect(() => {
    if (xpIntervalRef.current) clearInterval(xpIntervalRef.current)
    const step = Math.ceil(XP_INITIAL / 40)
    xpIntervalRef.current = setInterval(() => {
      setDisplayedXP((prev) => {
        if (prev >= XP_INITIAL) {
          clearInterval(xpIntervalRef.current)
          return XP_INITIAL
        }
        return Math.min(prev + step, XP_INITIAL)
      })
    }, 20)
    return () => clearInterval(xpIntervalRef.current)
  }, [])

  const xpPct = Math.round((displayedXP / XP_NEXT) * 100)

  const tabContent = {
    habits:    <HabitsTab habits={habits} setHabits={setHabits} supps={supps} setSupps={setSupps} />,
    stats:     <StatsTab />,
    lessons:   <LessonsTab />,
    character: <CharacterTab coins={coins} setCoins={setCoins} store={store} setStore={setStore} owned={owned} setOwned={setOwned} />,
    calendar:  <CalendarTab events={events} setEvents={setEvents} />,
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', minHeight: '100vh', background: PALETTE.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: PALETTE.text, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: PALETTE.surface, borderBottom: `1px solid ${PALETTE.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5, background: `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.blue})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JHabits</div>
          <div style={{ fontSize: 11, color: PALETTE.muted, marginTop: 1 }}>Thursday, May 15</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 20, padding: '5px 12px' }}>
            <span style={{ fontSize: 14 }}>🪙</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: PALETTE.gold }}>{coins}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 20, padding: '5px 12px' }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: PALETTE.accent }}>Lv{LEVEL}</span>
          </div>
        </div>
      </div>

      {/* XP bar below header */}
      <div style={{ height: 3, background: PALETTE.border }}>
        <div style={{ width: `${xpPct}%`, height: '100%', background: `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.blue})`, transition: 'width 0.05s linear' }} />
      </div>

      {/* Content with scroll ref */}
      <div ref={scrollRef} style={{ flex: 1, padding: '16px 16px 80px', overflowY: 'auto' }}>
        <Suspense fallback={<TabFallback />}>
          {tabContent[tab]}
        </Suspense>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 420, background: PALETTE.surface, borderTop: `1px solid ${PALETTE.border}`, display: 'flex', zIndex: 20 }}>
        {NAV_ITEMS.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
          >
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 9, color: tab === n.id ? PALETTE.accent : PALETTE.muted, fontWeight: tab === n.id ? 700 : 400, letterSpacing: 0.3 }}>{n.label}</span>
            {tab === n.id && <div style={{ width: 4, height: 4, borderRadius: '50%', background: PALETTE.accent }} />}
          </button>
        ))}
      </div>
    </div>
  )
}
