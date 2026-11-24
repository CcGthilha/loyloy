import { cleanWish } from '../wish.js'
import { boxTopic, open, randomId, seal } from './crypto.js'

const ITEMS_MAX = 50

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

// ฝั่งคนลอย: ล็อกคำขอแล้วฝากไว้ให้เจ้าของมาอ่านเมื่อไหร่ก็ได้
export function createOutbox({ connect, publicKey }) {
  const store = createStore({ delivered: false })
  let transport = null
  let turn = 0

  return {
    ...store,
    open() {
      transport = connect({ onStatus: () => {} })
    },
    float(wish) {
      const mine = turn
      const message = seal({ wish, at: Date.now() }, publicKey)
      transport?.leave(`${boxTopic(publicKey)}/${randomId()}`, message, () => {
        if (mine === turn) store.set({ delivered: true })
      })
    },
    again() {
      turn += 1
      store.set({ delivered: false })
    },
    close() {
      transport?.close()
      transport = null
    },
  }
}

// ฝั่งเจ้าของ: จำที่เคยเห็นไว้ในเครื่องด้วย เผื่อตัวกลางลบไปก่อน
export function createInbox({ connect, publicKey, secretKey, saved }) {
  const topic = boxTopic(publicKey)
  const load = () => saved.read() ?? { items: [], removed: [] }
  const memory = load()
  const store = createStore({ status: 'connecting', items: memory.items })
  let removed = memory.removed
  let transport = null

  const keep = (items) => {
    saved.write({ items, removed })
    store.set({ items })
  }

  return {
    ...store,
    open() {
      transport = connect({
        subscribe: `${topic}/+`,
        onStatus: (status) => store.set({ status }),
        onMessage: (from, text) => {
          const id = from.startsWith(`${topic}/`) ? from.slice(topic.length + 1) : ''
          const { items } = store.getState()
          if (!/^[0-9a-f]{16}$/.test(id) || removed.includes(id) || items.some((item) => item.id === id)) return
          const message = open(text, secretKey)
          const wish = cleanWish(message?.wish)
          if (!wish) return
          const at = Number.isFinite(message.at) ? Math.min(message.at, Date.now()) : Date.now()
          keep([...items, { id, wish, at }].sort((a, b) => b.at - a.at).slice(0, ITEMS_MAX))
        },
      })
    },
    remove(id) {
      removed = [...removed, id].slice(-200)
      keep(store.getState().items.filter((item) => item.id !== id))
      transport?.leave(`${topic}/${id}`, '')
    },
    close() {
      transport?.close()
      transport = null
    },
  }
}
