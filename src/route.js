import { fromBase64, ownsBox, toBase64 } from './room/crypto.js'
import { cleanWish, OWNER_PUBLIC } from './wish.js'

const KEY = 'loykrathong-key'
const INBOX = 'loykrathong-inbox'

const read = (name) => {
  try {
    return localStorage.getItem(name)
  } catch {
    return null
  }
}
const write = (name, value) => {
  try {
    localStorage.setItem(name, value)
  } catch { /* โหมดส่วนตัว: เปิดลิงก์ลับใหม่ทุกครั้งแทน */ }
}

export const savedInbox = {
  read() {
    try {
      const { items, removed } = JSON.parse(read(INBOX))
      return Array.isArray(items) && Array.isArray(removed) ? { items, removed } : null
    } catch {
      return null
    }
  },
  write: (value) => write(INBOX, JSON.stringify(value)),
}

export const packReply = (wish) => `r.${toBase64(new TextEncoder().encode(wish))}`

const unpackReply = (text) => {
  try {
    return text.length > 2048 ? '' : cleanWish(new TextDecoder('utf-8', { fatal: true }).decode(fromBase64(text)))
  } catch {
    return ''
  }
}

// #me.กุญแจ = หน้าลับเจ้าของ (จำกุญแจไว้ในเครื่อง), #r.… = ลิงก์ย้อนดู, อื่นๆ = หน้าลอย
export function readRoute(hash, publicKey = OWNER_PUBLIC) {
  const text = hash.replace(/^#/, '')
  if (text === 'me' || text.startsWith('me.')) {
    const secretKey = text === 'me' ? read(KEY) : text.slice(3)
    if (!secretKey || !ownsBox(secretKey, publicKey)) return { page: 'guest' }
    write(KEY, secretKey)
    return { page: 'inbox', secretKey, remembered: read(KEY) === secretKey }
  }
  const reply = text.startsWith('r.') ? unpackReply(text.slice(2)) : ''
  return reply ? { page: 'replay', reply } : { page: 'guest' }
}
