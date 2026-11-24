import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { boxTopic, newKeyPair, open, ownsBox, seal } from '../src/room/crypto.js'
import { createInbox, createOutbox } from '../src/room/link.js'
import { packReply, readRoute } from '../src/route.js'
import { clip, OWNER_PUBLIC, WISH_MAX } from '../src/wish.js'

const owner = newKeyPair()
let broker
let readers
let offline

const matches = (filter, topic) => filter.endsWith('/+') && topic.startsWith(filter.slice(0, -1))
const connect = ({ subscribe, onMessage, onStatus }) => {
  const reader = { subscribe, onMessage }
  readers.add(reader)
  queueMicrotask(() => {
    onStatus('online')
    if (subscribe) for (const [topic, text] of broker) if (matches(subscribe, topic)) onMessage(topic, text)
  })
  return {
    leave(topic, text, onDone) {
      if (offline) return
      if (text) broker.set(topic, text)
      else broker.delete(topic)
      for (const r of readers) if (r.subscribe && matches(r.subscribe, topic)) r.onMessage(topic, text)
      onDone?.()
    },
    close: () => readers.delete(reader),
  }
}

const memory = () => {
  let value = null
  return { read: () => value && JSON.parse(value), write: (v) => { value = JSON.stringify(v) } }
}
const inbox = (saved = memory()) => {
  const box = createInbox({ connect, publicKey: owner.publicKey, secretKey: owner.secretKey, saved })
  box.open()
  return box
}
const outbox = () => {
  const box = createOutbox({ connect, publicKey: owner.publicKey })
  box.open()
  return box
}
const wishes = (box) => box.getState().items.map((item) => item.wish)

beforeEach(() => {
  broker = new Map()
  readers = new Set()
  offline = false
})

test('เจ้าของไม่อยู่ตอนลอย เปิดมาทีหลังก็ได้อ่าน', async () => {
  const guest = outbox()
  guest.float('ขอให้จริง')
  assert.equal(guest.getState().delivered, true)
  guest.close()
  const box = inbox()
  await Promise.resolve()
  assert.deepEqual(wishes(box), ['ขอให้จริง'])
})

test('เจ้าของเปิดรออยู่ เห็นทันที', async () => {
  const box = inbox()
  await Promise.resolve()
  outbox().float('สดๆ')
  assert.deepEqual(wishes(box), ['สดๆ'])
})

test('ตัวกลางเห็นแค่ข้อความล็อก', () => {
  outbox().float('ความลับ')
  const [[topic, text]] = broker
  assert.ok(topic.startsWith(boxTopic(owner.publicKey)))
  assert.ok(!Buffer.from(text, 'base64url').toString().includes('ความลับ'))
  assert.equal(open(text, newKeyPair().secretKey), null)
  assert.equal(open(text, owner.secretKey).wish, 'ความลับ')
})

test('ลอยหลายรอบเก็บทุกอัน ไม่ซ้ำเวลาต่อใหม่', async () => {
  const guest = outbox()
  guest.float('หนึ่ง')
  guest.again()
  assert.equal(guest.getState().delivered, false)
  guest.float('สอง')
  const saved = memory()
  inbox(saved).close()
  const box = inbox(saved)
  await Promise.resolve()
  box.close()
  box.open()
  await Promise.resolve()
  assert.deepEqual(wishes(box).sort(), ['สอง', 'หนึ่ง'].sort())
})

test('ตัวกลางลบไปแล้ว ที่เคยเห็นยังอยู่ในเครื่อง', async () => {
  outbox().float('เก็บไว้')
  const saved = memory()
  inbox(saved)
  await Promise.resolve()
  broker.clear()
  assert.deepEqual(wishes(inbox(saved)), ['เก็บไว้'])
})

test('ลบแล้วหายทั้งสองที่ และไม่โผล่กลับมา', async () => {
  outbox().float('ลบนะ')
  const copy = new Map(broker)
  const saved = memory()
  const box = inbox(saved)
  await Promise.resolve()
  box.remove(box.getState().items[0].id)
  assert.equal(broker.size, 0)
  broker = copy
  const again = inbox(saved)
  await Promise.resolve()
  assert.deepEqual(wishes(again), [])
})

test('ข้อความมั่วหรือยาวเกินโดนทิ้ง/ตัด', async () => {
  const base = boxTopic(owner.publicKey)
  broker.set(`${base}/0000000000000001`, 'ขยะ')
  broker.set(`${base}/0000000000000002`, seal({ wish: 5 }, owner.publicKey))
  broker.set(`${base}/notanid`, seal({ wish: 'x' }, owner.publicKey))
  broker.set(`${base}/0000000000000003`, seal({ wish: 'ก'.repeat(200), at: 'x' }, owner.publicKey))
  const box = inbox()
  await Promise.resolve()
  assert.deepEqual(wishes(box), ['ก'.repeat(WISH_MAX)])
})

test('เน็ตหลุด: ไม่ขึ้นว่าฝากแล้ว', () => {
  offline = true
  const guest = outbox()
  guest.float('ยังไม่ถึง')
  assert.equal(guest.getState().delivered, false)
})

test('เส้นทาง: หน้าลับเปิดได้เฉพาะกุญแจถูก', () => {
  assert.equal(readRoute('').page, 'guest')
  assert.equal(readRoute('#me').page, 'guest')
  assert.equal(readRoute(`#me.${newKeyPair().secretKey}`).page, 'guest')
  assert.equal(readRoute('#me.!!').page, 'guest')
  assert.equal(readRoute(`#me.${owner.secretKey}`, owner.publicKey).page, 'inbox')
  assert.equal(ownsBox(OWNER_PUBLIC, OWNER_PUBLIC), false)
  assert.deepEqual(readRoute(`#${packReply('ขอให้ 🌕')}`), { page: 'replay', reply: 'ขอให้ 🌕' })
  for (const bad of ['#r.', '#r.!!!', '#อะไร']) assert.equal(readRoute(bad).page, 'guest')
})

test('ตัดข้อความไทยไม่ให้สระขาด', () => {
  assert.equal(clip('ที่'.repeat(WISH_MAX + 5)), 'ที่'.repeat(WISH_MAX))
  assert.equal(clip(5), '')
})
