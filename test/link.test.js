import assert from 'node:assert/strict'
import { afterEach, beforeEach, mock, test } from 'node:test'
import { packInvite, packReply, readRoute } from '../src/invite.js'
import { clip } from '../src/krathong.js'
import { deriveRoom, isSecret, newSecret, open, seal } from '../src/room/crypto.js'
import { createGuest, createHost } from '../src/room/link.js'

let links
const connect = ({ onMessage, onStatus }) => {
  const link = { onMessage, up: true }
  links.add(link)
  queueMicrotask(() => onStatus('online'))
  return {
    send(m) {
      for (const other of links) {
        if (other !== link && other.up && link.up) other.onMessage(structuredClone(m))
      }
    },
    close: () => links.delete(link),
  }
}

beforeEach(() => {
  links = new Set()
  mock.timers.enable({ apis: ['setInterval', 'Date'] })
})
afterEach(() => mock.timers.reset())

const invite = () => ({ host: 'ต้นน้ำ', guest: 'ปลาวาฬ', wish: 'ขอให้ "ปีหน้า" <b>ได้</b> ลอยด้วยกัน 🌕', secret: newSecret() })

test('ลิงก์ชวนเก็บคำขอไทย อิโมจิ และเครื่องหมายได้ครบ', () => {
  const mine = invite()
  const hash = packInvite(mine)
  assert.match(hash, /^[\w-]+$/)
  assert.deepEqual(readRoute(`#${hash}`), { page: 'guest', invite: mine })
})

test('ลิงก์ส่งกลับมีคำขอครบสองคน', () => {
  const mine = invite()
  assert.deepEqual(readRoute(`#${packReply(mine, 'ขอให้จริง')}`), { page: 'replay', invite: mine, reply: 'ขอให้จริง' })
})

test('ลิงก์พังไม่ทำให้เว็บล่ม', () => {
  for (const bad of ['#x', '#r.', '#r.abc', '#!!!', `#${packInvite(invite()).slice(0, 30)}`, `#${btoa('null')}`]) {
    assert.deepEqual(readRoute(bad), { page: 'create', broken: true }, bad)
  }
  assert.deepEqual(readRoute(`#r.${packInvite(invite())}`), { page: 'create', broken: true })
  assert.deepEqual(readRoute(''), { page: 'create' })
  assert.deepEqual(readRoute('#me'), { page: 'create' })
})

test('เปิดพร้อมกัน: เห็นว่ามาแล้ว ลอย แล้วได้คำขอพร้อมกัน', async () => {
  const host = createHost({ connect })
  host.open()
  const guest = createGuest({ id: 'g', connect })
  guest.open()
  await Promise.resolve()
  assert.equal(host.getState().here, true)
  assert.equal(host.getState().reply, null)
  guest.float('ขอให้จริง')
  assert.equal(host.getState().reply.wish, 'ขอให้จริง')
  assert.equal(guest.getState().delivered, true)
})

test('เจ้าของลิงก์ไม่อยู่: ยังไม่ขึ้นว่าส่งถึง พอเปิดมาก็ได้รับ', async () => {
  const guest = createGuest({ id: 'g', connect })
  guest.open()
  await Promise.resolve()
  guest.float('ขอให้จริง')
  mock.timers.tick(10000)
  assert.equal(guest.getState().delivered, false)
  const host = createHost({ connect })
  host.open()
  mock.timers.tick(2000)
  assert.equal(host.getState().reply.wish, 'ขอให้จริง')
  assert.equal(guest.getState().delivered, true)
})

test('ข้อความตอบรับหาย: ส่งซ้ำแต่ไม่เล่นฉากซ้ำ', async () => {
  const host = createHost({ connect })
  host.open()
  const guest = createGuest({ id: 'g', connect })
  guest.open()
  await Promise.resolve()
  const [, guestLink] = links
  const real = guestLink.onMessage
  guestLink.onMessage = () => {}
  guest.float('ขอให้จริง')
  const first = host.getState().reply
  assert.equal(guest.getState().delivered, false)
  guestLink.onMessage = real
  mock.timers.tick(2000)
  assert.equal(guest.getState().delivered, true)
  assert.equal(host.getState().reply, first)
})

test('ลอยอีกรอบเป็นคำขอใหม่ และปิดหน้าแล้วหายไป', async () => {
  const host = createHost({ connect })
  host.open()
  const guest = createGuest({ id: 'g', connect })
  guest.open()
  await Promise.resolve()
  guest.float('หนึ่ง')
  guest.again()
  assert.equal(guest.getState().delivered, false)
  guest.float('สอง')
  assert.equal(host.getState().reply.wish, 'สอง')
  guest.close()
  mock.timers.tick(10000)
  assert.equal(host.getState().here, false)
})

test('เข้ารหัส: เปิดได้เฉพาะคนมีลิงก์ถูก', () => {
  const secret = newSecret()
  assert.ok(isSecret(secret))
  const { key, topic } = deriveRoom(secret)
  const text = seal({ wish: 'รักนะ' }, key)
  assert.deepEqual(open(text, key), { wish: 'รักนะ' })
  assert.equal(open(text, deriveRoom(newSecret()).key), null)
  assert.equal(open('ขยะ', key), null)
  assert.ok(!topic.includes(secret))
})

test('ตัดข้อความไทยไม่ให้สระขาด', () => {
  assert.equal(clip('ที่นี่', 1), 'ที่')
  assert.equal(clip(5, 1), '')
})
