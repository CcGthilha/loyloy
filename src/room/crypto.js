import nacl from 'tweetnacl'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes))
const fromBase64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

export const randomId = () => toHex(nacl.randomBytes(8))

export const newSecret = () =>
  toBase64(nacl.randomBytes(18)).replaceAll('+', '-').replaceAll('/', '_')

export const isSecret = (text) => /^[\w-]{24}$/.test(text)

// รหัสอยู่หลัง # ในลิงก์ ไม่ถูกส่งให้ตัวกลาง: ตัวกลางเห็นแค่ชื่อห้องที่ hash แล้วกับข้อความเข้ารหัส
export function deriveRoom(secret) {
  const topic = nacl.hash(encoder.encode(`topic:${secret}`)).slice(0, 16)
  const key = nacl.hash(encoder.encode(`key:${secret}`)).slice(0, 32)
  return { topic: `loykrathong/v1/${toHex(topic)}`, key }
}

export function seal(message, key) {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  const box = nacl.secretbox(encoder.encode(JSON.stringify(message)), nonce, key)
  const packed = new Uint8Array(nonce.length + box.length)
  packed.set(nonce)
  packed.set(box, nonce.length)
  return toBase64(packed)
}

export function open(text, key) {
  try {
    if (text.length > 4096) return null
    const packed = fromBase64(text)
    const size = nacl.secretbox.nonceLength
    const plain = nacl.secretbox.open(packed.slice(size), packed.slice(0, size), key)
    return plain && JSON.parse(decoder.decode(plain))
  } catch {
    return null
  }
}
