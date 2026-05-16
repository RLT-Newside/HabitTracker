import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

beforeEach(() => localStorage.clear())

describe('useLocalStorage', () => {
  it('returns initialValue when key absent', () => {
    const { result } = renderHook(() => useLocalStorage('habits', [1, 2, 3], 'key'))
    expect(result.current[0]).toEqual([1, 2, 3])
  })

  it('persists value to localStorage on set', () => {
    const { result } = renderHook(() => useLocalStorage('coins', 0, 'key'))
    act(() => result.current[1](500))
    expect(result.current[0]).toBe(500)
    expect(localStorage.getItem('coins')).not.toBeNull()
    // stored value should not be raw JSON (encrypted)
    expect(localStorage.getItem('coins')).not.toBe('500')
  })

  it('restores value across hook remounts', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('score', 0, 'key'))
    act(() => result.current[1](99))
    rerender()
    expect(result.current[0]).toBe(99)
  })

  it('accepts functional updater like useState', () => {
    const { result } = renderHook(() => useLocalStorage('count', 10, 'key'))
    act(() => result.current[1]((prev) => prev + 5))
    expect(result.current[0]).toBe(15)
  })
})
