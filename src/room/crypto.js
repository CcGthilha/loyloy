import nacl from 'tweetnacl'

const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })
const { publicKeyLength, secretKeyLength, nonceLength } = nacl.box

export const toBase64 = (bytes) =>
  btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
export const fromBase64 = (text) =>
  Uint8Array.from(atob(text.replaceAll('-', '+').replaceAll('_', '/')), (c) => c.charCodeAt(0))
const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

export const randomId = () => toHex(nacl.randomBytes(8))
export const newKeyPair = () => {
  const { publicKey, secretKey } = nacl.box.keyPair()
  return { publicKey: toBase64(publicKey), secretKey: toBase64(secretKey) }
}

export const boxTopic = (publicKey) =>
  `loykrathong/v2/${toHex(nacl.hash(encoder.encode(`box:${publicKey}`)).slice(0, 16))}`

export function ownsBox(secretKey, publicKey) {
  try {
    const bytes = fromBase64(secretKey)
    return bytes.length === secretKeyLength && toBase64(nacl.box.keyPair.fromSecretKey(bytes).publicKey) === publicKey
  } catch {
    return false
  }
}

// ล็อกด้วยกุญแจสาธารณะของเจ้าของ: แม้แต่คนส่งก็เปิดคืนไม่ได้
export function seal(message, publicKey) {
  const once = nacl.box.keyPair()
  const nonce = nacl.randomBytes(nonceLength)
  const box = nacl.box(encoder.encode(JSON.stringify(message)), nonce, fromBase64(publicKey), once.secretKey)
  const packed = new Uint8Array(publicKeyLength + nonceLength + box.length)
  packed.set(once.publicKey)
  packed.set(nonce, publicKeyLength)
  packed.set(box, publicKeyLength + nonceLength)
  return toBase64(packed)
}

export function open(text, secretKey) {
  try {
    if (text.length > 4096) return null
    const packed = fromBase64(text)
    const from = packed.slice(0, publicKeyLength)
    const nonce = packed.slice(publicKeyLength, publicKeyLength + nonceLength)
    const plain = nacl.box.open(packed.slice(publicKeyLength + nonceLength), nonce, from, fromBase64(secretKey))
    return plain && JSON.parse(decoder.decode(plain))
  } catch {
    return null
  }
}
