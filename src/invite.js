import { clip, NAME_MAX, WISH_MAX } from './krathong.js'
import { isSecret } from './room/crypto.js'

const STORE = 'loykrathong-mine'

// คำขออยู่หลัง # ในลิงก์ เบราว์เซอร์ไม่ส่งส่วนนี้ไปที่โฮสต์
const encode = (value) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value))))
    .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')

const decode = (text) => {
  const bytes = Uint8Array.from(atob(text.replaceAll('-', '+').replaceAll('_', '/')), (c) => c.charCodeAt(0))
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
}

const clean = (v) => {
  const invite = {
    host: clip(v?.host, NAME_MAX).trim() || 'เค้า',
    guest: clip(v?.guest, NAME_MAX).trim() || 'เธอ',
    wish: clip(v?.wish, WISH_MAX).trim(),
    secret: v?.secret,
  }
  return invite.wish && isSecret(invite.secret) ? invite : null
}

export const packInvite = ({ host, guest, wish, secret }) => encode([host, guest, wish, secret])
export const packReply = (invite, reply) =>
  `r.${encode([invite.host, invite.guest, invite.wish, invite.secret, reply])}`

export function saveMine(invite) {
  try {
    localStorage.setItem(STORE, packInvite(invite))
  } catch { /* โหมดส่วนตัว: รีเฟรชแล้วต้องเขียนใหม่ */ }
}

export function readMine() {
  try {
    const text = localStorage.getItem(STORE)
    return text ? unpack(text) : null
  } catch {
    return null
  }
}

function unpack(text) {
  try {
    if (text.length > 8192) return null
    const [host, guest, wish, secret] = decode(text)
    return clean({ host, guest, wish, secret })
  } catch {
    return null
  }
}

export function readRoute(hash) {
  const text = hash.replace(/^#/, '')
  if (!text) return { page: 'create' }
  if (text === 'me') {
    const invite = readMine()
    return invite ? { page: 'watch', invite } : { page: 'create' }
  }
  if (text.startsWith('r.')) {
    const body = text.slice(2)
    const invite = unpack(body)
    const reply = invite ? clip(decode(body)[4], WISH_MAX).trim() : ''
    return reply ? { page: 'replay', invite, reply } : { page: 'create', broken: true }
  }
  const invite = unpack(text)
  return invite ? { page: 'guest', invite } : { page: 'create', broken: true }
}
