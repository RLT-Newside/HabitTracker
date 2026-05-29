import { useEffect } from 'react'
import { useStorage } from './useStorage'

export type Theme = 'amber' | 'cyan' | 'green' | 'purple' | 'gold'

export const THEME_META: Record<Theme, { label: string; color: string }> = {
  amber:  { label: 'Amber',  color: '#d97706' },
  cyan:   { label: 'Cyan',   color: '#06b6d4' },
  green:  { label: 'Neon',   color: '#10b981' },
  purple: { label: 'Violet', color: '#a855f7' },
  gold:   { label: 'Gold',   color: '#eab308' },
}

export function useTheme() {
  const [theme, setTheme] = useStorage<Theme>('habits_theme', 'amber')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'amber' ? '' : theme)
  }, [theme])

  return { theme, setTheme }
}
