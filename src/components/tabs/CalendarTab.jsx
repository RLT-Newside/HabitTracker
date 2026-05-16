import { useState } from 'react'
import { PALETTE } from '../../constants.js'

const TODAY = 16
const FIRST_DOW = 3 // May 2026 starts Thursday (0=Mon)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export default function CalendarTab({ events, setEvents }) {
  const [selected, setSelected] = useState(null)
  const [newEvent, setNewEvent] = useState('')

  const addEvent = () => {
    if (selected && newEvent.trim()) {
      setEvents((e) => [...e.filter((x) => x.day !== selected), { day: selected, label: newEvent.trim(), color: PALETTE.accent }])
      setNewEvent('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: PALETTE.text }}>May 2026</div>
          <div style={{ fontSize: 12, color: PALETTE.muted }}>← →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, color: PALETTE.muted, paddingBottom: 4 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array(FIRST_DOW).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {DAYS.map((d) => {
            const ev = events.find((e) => e.day === d)
            const isToday = d === TODAY
            const isSel = d === selected
            return (
              <div
                key={d}
                onClick={() => setSelected(d === selected ? null : d)}
                style={{ aspectRatio: 1, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: isSel ? PALETTE.accent : isToday ? PALETTE.accentSoft : ev ? ev.color + '22' : 'transparent', border: `1px solid ${isToday ? PALETTE.accent : isSel ? PALETTE.accent : ev ? ev.color + '55' : 'transparent'}`, position: 'relative', transition: 'all 0.15s' }}
              >
                <span style={{ fontSize: 12, fontWeight: isToday || isSel ? 700 : 400, color: isSel ? '#fff' : isToday ? PALETTE.accent : PALETTE.text }}>{d}</span>
                {ev && <div style={{ width: 4, height: 4, borderRadius: '50%', background: isSel ? '#fff' : ev.color, marginTop: 1 }} />}
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.accent}44`, borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 600, color: PALETTE.text, marginBottom: 10 }}>May {selected}</div>
          {events.filter((e) => e.day === selected).map((e) => (
            <div key={e.day} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
              <span style={{ color: PALETTE.text, fontSize: 14 }}>{e.label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEvent()}
              placeholder="Add event..."
              style={{ flex: 1, background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '9px 12px', color: PALETTE.text, fontSize: 13 }}
            />
            <button onClick={addEvent} style={{ background: PALETTE.accent, border: 'none', color: '#fff', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Add</button>
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, letterSpacing: 1, marginBottom: 10 }}>UPCOMING</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {events.filter((e) => e.day >= TODAY).sort((a, b) => a.day - b.day).slice(0, 5).map((e) => (
            <div key={e.day} style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: e.color + '22', border: `1px solid ${e.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: e.color, flexShrink: 0 }}>{e.day}</div>
              <div>
                <div style={{ fontWeight: 500, color: PALETTE.text, fontSize: 14 }}>{e.label}</div>
                <div style={{ fontSize: 11, color: PALETTE.muted }}>May {e.day}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
