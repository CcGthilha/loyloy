import { clip, WISH_MAX } from '../krathong.js'

const BEAT = 2000
const GONE = 7000

function createStore(initial) {
  let state = initial
  const listeners = new Set()
  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    set(patch) {
      state = { ...state, ...patch }
      listeners.forEach((listener) => listener())
    },
  }
}

// ฝั่งคนที่ได้ลิงก์: บอกว่ามาแล้ว พอลอยก็ส่งคำขอซ้ำจนกว่าอีกฝั่งตอบว่าได้รับ
export function createGuest({ id, connect }) {
  const store = createStore({ status: 'connecting', delivered: false })
  let wish = null
  let turn = 0
  let transport = null
  let beat = null

  const send = () => {
    if (!transport) return
    if (wish === null) transport.send({ t: 'here', id, turn })
    else if (!store.getState().delivered) transport.send({ t: 'float', id, turn, wish })
  }

  return {
    ...store,
    open() {
      transport = connect({
        onStatus: (status) => {
          store.set({ status })
          if (status === 'online') send()
        },
        onMessage: (m) => {
          if (m?.t === 'seen' && m.id === id && m.turn === turn && wish !== null) store.set({ delivered: true })
        },
      })
      beat = setInterval(send, BEAT)
    },
    float(text) {
      wish = text
      send()
    },
    again() {
      wish = null
      turn += 1
      store.set({ delivered: false })
      send()
    },
    close() {
      clearInterval(beat)
      transport?.close()
      transport = null
    },
  }
}

// ฝั่งคนเขียนคำขอ: เปิดหน้าไว้แล้วจะเห็นกระทงลอยพร้อมกัน
export function createHost({ connect }) {
  const store = createStore({ status: 'connecting', here: false, reply: null })
  let lastHere = 0
  let transport = null
  let beat = null

  const onMessage = (m) => {
    if (typeof m?.id !== 'string' || !Number.isSafeInteger(m.turn)) return
    if (m.t === 'here') {
      lastHere = Date.now()
      if (!store.getState().here) store.set({ here: true })
    } else if (m.t === 'float') {
      const wish = clip(m.wish, WISH_MAX).trim()
      if (!wish) return
      const key = `${m.id}:${m.turn}`
      if (store.getState().reply?.key !== key) store.set({ reply: { key, wish } })
      transport?.send({ t: 'seen', id: m.id, turn: m.turn })
    }
  }

  return {
    ...store,
    open() {
      transport = connect({ onStatus: (status) => store.set({ status }), onMessage })
      beat = setInterval(() => {
        if (store.getState().here && Date.now() - lastHere > GONE) store.set({ here: false })
      }, BEAT)
    },
    close() {
      clearInterval(beat)
      transport?.close()
      transport = null
    },
  }
}
