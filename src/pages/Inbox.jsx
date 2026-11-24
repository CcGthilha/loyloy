import { useEffect, useState, useSyncExternalStore } from 'react'
import { ArrowLeft, Play, Trash2, WifiOff } from 'lucide-react'
import Couple from '../components/Couple.jsx'
import { createInbox } from '../room/link.js'
import { connectTransport } from '../room/transport.js'
import { savedInbox } from '../route.js'
import { useEnded } from '../useEnded.js'
import { OWNER_PUBLIC } from '../wish.js'

const time = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function Inbox({ secretKey, onFloat }) {
  const [box] = useState(() => createInbox({ connect: connectTransport, publicKey: OWNER_PUBLIC, secretKey, saved: savedInbox }))
  const { status, items } = useSyncExternalStore(box.subscribe, box.getState)
  const [playing, setPlaying] = useState(null)
  const floating = playing !== null
  const ended = useEnded(floating)

  useEffect(() => {
    box.open()
    return box.close
  }, [box])
  useEffect(() => onFloat(floating), [floating, onFloat])

  if (floating) {
    return (
      <div className="play floating">
        <Couple reply={playing} floating />
        <div className="foot" />
        {ended && <div className="end"><button className="ghost" type="button" onClick={() => setPlaying(null)}><ArrowLeft size={18} aria-hidden="true" />กลับ</button></div>}
      </div>
    )
  }

  const remove = (item) => {
    if (window.confirm(`ลบ "${item.wish}" ไหม ลบแล้วเอาคืนไม่ได้`)) box.remove(item.id)
  }

  return (
    <div className="inbox">
      <h1>เธอขอว่า</h1>
      {status === 'offline' && <p className="status" role="status"><WifiOff size={18} aria-hidden="true" />สัญญาณหลุด กำลังต่อใหม่</p>}
      {items.length === 0 && status !== 'offline' && (
        <p className="status" role="status">{status === 'connecting' ? 'กำลังเปิดดู' : 'ยังไม่มีใครลอยมา'}</p>
      )}
      <ul>
        {items.map((item) => (
          <li key={item.id} className="panel letter">
            <p>{item.wish}</p>
            <footer>
              <time>{time.format(item.at)}</time>
              <button className="ghost" type="button" aria-label="ดูตอนลอย" onClick={() => setPlaying(item.wish)}><Play size={18} aria-hidden="true" /></button>
              <button className="ghost" type="button" aria-label="ลบ" onClick={() => remove(item)}><Trash2 size={18} aria-hidden="true" /></button>
            </footer>
          </li>
        ))}
      </ul>
    </div>
  )
}
