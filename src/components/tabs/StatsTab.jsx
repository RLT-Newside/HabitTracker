import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { PALETTE, WEEK_DATA, MONTHLY_DATA } from '../../constants.js'

export default function StatsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'Completion', value: '83%', color: PALETTE.green },
          { label: 'Best Streak', value: '21d', color: PALETTE.gold },
          { label: 'Total XP', value: '3.4k', color: PALETTE.accent },
        ].map((m) => (
          <div key={m.label} style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: PALETTE.muted, marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, marginBottom: 12 }}>WEEKLY SCORE</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={MONTHLY_DATA}>
            <CartesianGrid stroke={PALETTE.border} strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[50, 100]} tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 8, color: PALETTE.text }} />
            <Line type="monotone" dataKey="score" stroke={PALETTE.accent} strokeWidth={2} dot={{ fill: PALETTE.accent, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, marginBottom: 12 }}>WATER INTAKE (L) — THIS WEEK</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={WEEK_DATA}>
            <CartesianGrid stroke={PALETTE.border} strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 4]} tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 8, color: PALETTE.text }} />
            <Bar dataKey="water" fill={PALETTE.blue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, marginBottom: 12 }}>HABIT HEATMAP — GYM SESSIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
          {WEEK_DATA.flatMap((d, wi) =>
            [d.gym, ...Array(6).fill(Math.random() > 0.5 ? 1 : 0)].map((v, di) => (
              <div
                key={`${wi}-${di}`}
                style={{ height: 28, borderRadius: 4, background: v ? PALETTE.accent + (di % 3 === 0 ? 'cc' : '66') : PALETTE.border, transition: 'all 0.2s', cursor: 'default' }}
              />
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 11, color: PALETTE.muted }}>Less</span>
          {[PALETTE.border, PALETTE.accent + '44', PALETTE.accent + '88', PALETTE.accent].map((c, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />
          ))}
          <span style={{ fontSize: 11, color: PALETTE.muted }}>More</span>
        </div>
      </div>
    </div>
  )
}
