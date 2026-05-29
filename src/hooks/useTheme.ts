import { useEffect } from 'react'
import { useStorage } from './useStorage'

export type Theme = 'amber' | 'green' | 'blue' | 'purple'

export function useTheme() {
  const [theme, setTheme] = useStorage<Theme>('habits_theme', 'amber')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'amber' ? '' : theme)
  }, [theme])

  return { theme, setTheme }
}
