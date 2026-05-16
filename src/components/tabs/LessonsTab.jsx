import { useState } from 'react'
import { PALETTE, PLAYLIST } from '../../constants.js'

export default function LessonsTab() {
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [editing, setEditing] = useState(false)
  const [watching, setWatching] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 14, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: PALETTE.text }}>Daily Learning</div>
            <div style={{ fontSize: 12, color: PALETTE.muted }}>Default: JHabits Growth Playlist</div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            style={{ background: PALETTE.accentSoft, border: `1px solid ${PALETTE.accent}55`, color: PALETTE.accent, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12 }}
          >
            {editing ? 'Save' : 'Connect own'}
          </button>
        </div>
        {editing && (
          <input
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder="Paste YouTube playlist URL..."
            style={{ width: '100%', background: PALETTE.surface, border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: '10px 12px', color: PALETTE.text, fontSize: 13, boxSizing: 'border-box' }}
          />
        )}
      </div>

      <div style={{ background: PALETTE.accent + '22', border: `1px solid ${PALETTE.accent}44`, borderRadius: 14, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 32 }}>🎯</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: PALETTE.accent, marginBottom: 2 }}>TODAY'S LESSON</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: PALETTE.text }}>How to Build Discipline</div>
          <div style={{ fontSize: 12, color: PALETTE.muted }}>Andrew Huberman · 1:22:14</div>
        </div>
        <button
          onClick={() => setWatching(PLAYLIST[0])}
          style={{ background: PALETTE.accent, border: 'none', color: '#fff', borderRadius: 10, padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
        >
          ▶ Watch
        </button>
      </div>

      {watching && (
        <div style={{ background: PALETTE.card, border: `1px solid ${PALETTE.accent}66`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ background: '#000', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ fontSize: 48 }}>🎬</div>
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <button onClick={() => setWatching(null)} style={{ background: '#00000088', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
              <div style={{ height: 3, background: PALETTE.border, borderRadius: 2 }}>
                <div style={{ width: '34%', height: '100%', background: PALETTE.accent, borderRadius: 2 }} />
              </div>
            </div>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 600, color: PALETTE.text, fontSize: 14 }}>{watching.title}</div>
            <div style={{ fontSize: 12, color: PALETTE.muted }}>{watching.channel}</div>
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.muted, letterSpacing: 1, marginBottom: 10 }}>PLAYLIST</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PLAYLIST.map((v) => (
            <div
              key={v.id}
              onClick={() => setWatching(v)}
              style={{ background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
              <div style={{ width: 44, height: 44, background: PALETTE.surface, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎬</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, color: PALETTE.text, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
                <div style={{ fontSize: 11, color: PALETTE.muted }}>{v.channel} · {v.duration}</div>
              </div>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: PALETTE.accentSoft, color: PALETTE.accent, flexShrink: 0 }}>{v.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
