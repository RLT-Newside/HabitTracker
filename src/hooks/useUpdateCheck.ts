import { useState, useEffect } from 'react'

declare const __APP_VERSION__: string

interface UpdateInfo {
  available: boolean
  latestVersion: string
  downloadUrl: string
}

export function useUpdateCheck(): UpdateInfo {
  const [info, setInfo] = useState<UpdateInfo>({ available: false, latestVersion: '', downloadUrl: '' })

  useEffect(() => {
    fetch('https://api.github.com/repos/RLT-Newside/HabitTracker/releases/latest')
      .then(r => r.json())
      .then(data => {
        const latest = (data.tag_name || '').replace(/^v/, '')
        if (latest && latest !== __APP_VERSION__) {
          setInfo({
            available: true,
            latestVersion: latest,
            downloadUrl: data.html_url || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  return info
}
