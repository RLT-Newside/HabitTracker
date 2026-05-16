import { rc4, encryptToStorage, decryptFromStorage } from '../crypto/rc4.js'

describe('rc4', () => {
  it('encrypts and decrypts to original string', () => {
    const key = 'test-key'
    const plaintext = 'hello world'
    const cipher = rc4(key, plaintext)
    expect(cipher).not.toBe(plaintext)
    expect(rc4(key, cipher)).toBe(plaintext)
  })

  it('different keys produce different cipher', () => {
    const cipher1 = rc4('key1', 'data')
    const cipher2 = rc4('key2', 'data')
    expect(cipher1).not.toBe(cipher2)
  })
})

describe('encryptToStorage / decryptFromStorage', () => {
  it('round-trips an object', () => {
    const key = 'app-key'
    const data = { habits: [{ id: 1, progress: 2.5 }], coins: 100 }
    const stored = encryptToStorage(key, data)
    expect(typeof stored).toBe('string')
    const recovered = decryptFromStorage(key, stored)
    expect(recovered).toEqual(data)
  })

  it('returns null for invalid base64', () => {
    const result = decryptFromStorage('key', 'not-valid-base64!!!')
    expect(result).toBeNull()
  })
})
