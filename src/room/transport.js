import { deriveRoom, open, seal } from './crypto.js'

export const BROKER = 'wss://broker.hivemq.com:8884/mqtt'

export function connectTransport(secret, { onMessage, onStatus }) {
  const { topic, key } = deriveRoom(secret)
  let client = null
  let closed = false

  import('mqtt')
    .then(({ default: mqtt }) => {
      if (closed) return
      client = mqtt.connect(BROKER, { reconnectPeriod: 2000, connectTimeout: 10000, keepalive: 20 })
      client.on('connect', () => {
        client.subscribe(topic, (error) => {
          if (!closed) onStatus(error ? 'offline' : 'online')
        })
      })
      client.on('close', () => !closed && onStatus('offline'))
      client.on('error', () => !closed && onStatus('offline'))
      client.on('message', (_topic, payload) => {
        if (closed) return
        const message = open(payload.toString(), key)
        if (message) onMessage(message)
      })
    })
    .catch(() => !closed && onStatus('offline'))

  return {
    send(message) {
      if (client?.connected) client.publish(topic, seal(message, key))
    },
    close() {
      closed = true
      client?.end()
    },
  }
}
