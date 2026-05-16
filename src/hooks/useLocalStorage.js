import { useState, useEffect } from 'react'
import { encryptToStorage, decryptFromStorage } from '../crypto/rc4.js'

export function useLocalStorage(key, initialValue, encryptionKey) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key)
    if (stored === null) return initialValue
    const decoded = decryptFromStorage(encryptionKey, stored)
    return decoded !== null ? decoded : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, encryptToStorage(encryptionKey, state))
  }, [key, encryptionKey, state])

  const setValue = (value) => {
    setState((prev) => (typeof value === 'function' ? value(prev) : value))
  }

  return [state, setValue]
}
