import { PALETTE, XP_INITIAL, XP_NEXT, LEVEL } from '../../constants.js'

export default function CharacterTab({ coins, setCoins, store, setStore, owned, setOwned }) {
  const xpPct = Math.round((XP_INITIAL / XP_NEXT) * 100)
  const rarityColor = { Common: PALETTE.muted, Rare: PALETTE.blue, Epic: PALETTE.accent }

  const buy = (item) => {
    if (coins >= item.cost && !owned.includes(item.id)) {
      setCoins((c) => c - item.cost)
      setOwned((o) => [...o, item.id])
      setStore((s) => s.map((x) => (x.id === item.id ? { ...x, owned: true } : x)))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: `linear-gradient(135deg, ${PALETTE.card}, ${PALETTE.surface})`, border: `1px solid ${PALETTE.border}`, borderRadius: 20, padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 8, filter: 'drop-shadow(0 0 20px #6c63ff88)' }}>🦾</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: PALETTE.text }}>Justin</div>
        <div style={{ display: 'inline-block', background: PALETTE.accent, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20, marginTop: 6 }}>
          LVL {LEVEL} · Iron Athlete
        </div>
        <div style={{ margin: '16px 0 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: PALETTE.muted, marginBottom: 4 }}>
            <span>XP {XP_INITIAL.toLocaleString()}</span>
            <span>{XP_NEXT.toLocaleString()} next level</span>
          </div>
          <div style={{ height: 8, background: PALETTE.border, borderRadius: 4 }}>
            <div style={{ width: `${xpPct}%`, height: '100%', background: `linear-gradient(90deg, ${PALETTE.accent}, ${PALETTE.blue})`, borderRadius: 4, transition: 'width 0.6s' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
          {[['💪', 'STR', 74], ['⚡', 'AGI', 52], ['🧠', 'WIS', 68]].map(([icon, stat, val]) => (
            <div key={stat} style={{ background: PALETTE.surface, borderRadius: 10, padding: '10px 0' }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: PALETTE.text }}>{val}</div>
              <div style={{ fontSize: 10, color: PALETTE.muted }}>{stat}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🪙</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: PALETTE.gold }}>{coins}</span>
          <span style={{ fontSize: 12, color: PALETTE.muted }}>coins</span>
        </div>
        <div style={{ fontSize: 12, color: PALETTE.muted }}>Earn by completing habits daily</div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, letterSpacing: 1, marginBottom: 10 }}>🛒 STORE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {store.map((item) => {
            const isOwned = owned.includes(item.id)
            const canBuy = coins >= item.cost && !isOwned
            return (
              <div key={item.id} style={{ background: PALETTE.card, border: `1px solid ${isOwned ? PALETTE.green + '66' : PALETTE.border}`, borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 32, textAlign: 'center' }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: PALETTE.text, textAlign: 'center' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: rarityColor[item.rarity], textAlign: 'center' }}>{item.rarity}</div>
                <div style={{ fontSize: 11, color: PALETTE.green, textAlign: 'center' }}>{item.stat}</div>
                {isOwned ? (
                  <div style={{ textAlign: 'center', fontSize: 12, color: PALETTE.green, fontWeight: 600 }}>✓ Owned</div>
                ) : (
                  <button
                    onClick={() => buy(item)}
                    style={{ background: canBuy ? PALETTE.gold + '22' : PALETTE.surface, border: `1px solid ${canBuy ? PALETTE.gold : PALETTE.border}`, color: canBuy ? PALETTE.gold : PALETTE.muted, borderRadius: 8, padding: '7px 0', cursor: canBuy ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 600 }}
                  >
                    🪙 {item.cost}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
