// RC4 stream cipher — symmetric: rc4(key, rc4(key, x)) === x
export function rc4(key, data) {
  const S = [...Array(256).keys()]
  let j = 0
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % key.length)) % 256
    ;[S[i], S[j]] = [S[j], S[i]]
  }
  let i = 0
  j = 0
  return data
    .split('')
    .map((char) => {
      i = (i + 1) % 256
      j = (j + S[i]) % 256
      ;[S[i], S[j]] = [S[j], S[i]]
      return String.fromCharCode(char.charCodeAt(0) ^ S[(S[i] + S[j]) % 256])
    })
    .join('')
}

export function encryptToStorage(key, data) {
  const json = JSON.stringify(data)
  const cipher = rc4(key, json)
  return btoa(unescape(encodeURIComponent(cipher)))
}

export function decryptFromStorage(key, stored) {
  try {
    const cipher = decodeURIComponent(escape(atob(stored)))
    const json = rc4(key, cipher)
    return JSON.parse(json)
  } catch {
    return null
  }
}
