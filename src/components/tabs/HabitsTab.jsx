import { PALETTE, STREAK } from '../../constants.js'
import ProgressRing from '../ProgressRing.jsx'

export default function HabitsTab({ habits, setHabits, supps, setSupps }) {
  const toggleSupp = (id) => setSupps((s) => s.map((x) => (x.id === id ? { ...x, taken: !x.taken } : x)))

  const addProgress = (id, delta) =>
    setHabits((h) =>
      h.map((x) =>
        x.id === id ? { ...x, progress: Math.min(x.target, Math.max(0, +(x.progress + delta).toFixed(1))) } : x
      )
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: `linear-gradient(135deg, ${PALETTE.accent}33, ${PALETTE.gold}22)`, border: `1px solid ${PALETTE.accent}55`, borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 2 }}>CURRENT STREAK</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: PALETTE.gold }}>🔥 {STREAK} days</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 2 }}>TODAY'S XP</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: PALETTE.accent }}>+240 XP</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, letterSpacing: 1, marginBottom: 10 }}>HABITS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {habits.map((h) => {
            const pct = Math.min(100, Math.round((h.progress / h.target) * 100))
            return (
              <div key={h.id} style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <ProgressRing pct={pct} color={h.color} size={52} stroke={4} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{h.emoji}</span>
                    <span style={{ fontWeight: 600, color: PALETTE.text, fontSize: 15 }}>{h.name}</span>
                    <span style={{ fontSize: 11, color: PALETTE.muted, background: PALETTE.surface, padding: '2px 8px', borderRadius: 20 }}>{h.unit}</span>
                  </div>
                  <div style={{ height: 6, background: PALETTE.border, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: h.color, borderRadius: 3, transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.muted, marginTop: 4 }}>{h.progress} / {h.target} — {pct}%</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button
                    onClick={() => addProgress(h.id, h.type === 'daily' && h.name === 'Water' ? 0.25 : 1)}
                    style={{ background: h.color + '33', border: `1px solid ${h.color}55`, color: h.color, borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
                  >+</button>
                  <button
                    onClick={() => addProgress(h.id, h.type === 'daily' && h.name === 'Water' ? -0.25 : -1)}
                    style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, color: PALETTE.muted, borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}
                  >−</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, letterSpacing: 1, marginBottom: 10 }}>SUPPLEMENTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {supps.map((s) => (
            <div
              key={s.id}
              onClick={() => toggleSupp(s.id)}
              style={{ background: PALETTE.card, border: `1px solid ${s.taken ? s.color + '66' : PALETTE.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.taken ? s.color : PALETTE.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all 0.2s' }}>
                {s.taken ? '✓' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: s.taken ? s.color : PALETTE.text, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: PALETTE.muted }}>{s.dose} · {s.time}</div>
              </div>
              {s.taken && <span style={{ fontSize: 11, color: s.color, background: s.color + '22', padding: '3px 10px', borderRadius: 20 }}>Done</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
