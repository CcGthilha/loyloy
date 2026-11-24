export const BROKER = 'wss://broker.hivemq.com:8884/mqtt'
const KEEP_SECONDS = 7 * 24 * 60 * 60

export function connectTransport({ subscribe, onMessage, onStatus }) {
  let client = null
  let closed = false
  let waiting = []

  import('mqtt')
    .then(({ default: mqtt }) => {
      if (closed) return
      client = mqtt.connect(BROKER, { protocolVersion: 5, reconnectPeriod: 2000, connectTimeout: 10000, keepalive: 20 })
      client.on('connect', () => {
        if (!subscribe) {
          onStatus('online')
          return
        }
        client.subscribe(subscribe, { qos: 1 }, (error) => {
          if (!closed) onStatus(error ? 'offline' : 'online')
        })
      })
      client.on('close', () => !closed && onStatus('offline'))
      client.on('error', () => !closed && onStatus('offline'))
      client.on('message', (topic, payload) => !closed && onMessage?.(topic, payload.toString()))
      waiting.forEach((publish) => publish())
      waiting = []
    })
    .catch(() => !closed && onStatus('offline'))

  return {
    // ฝากไว้ที่ตัวกลาง (retain) จนหมดอายุ, onDone เรียกเมื่อตัวกลางตอบรับแล้ว
    leave(topic, text, onDone) {
      const publish = () => client.publish(
        topic,
        text,
        { qos: 1, retain: true, properties: text ? { messageExpiryInterval: KEEP_SECONDS } : undefined },
        (error, packet) => {
          const refused = error || (packet?.reasonCode ?? 0) >= 128
          if (!refused && !closed) onDone?.()
        },
      )
      if (client) publish()
      else waiting.push(publish)
    },
    close() {
      closed = true
      client?.end()
    },
  }
}
