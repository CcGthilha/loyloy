import { useEffect, useState, useSyncExternalStore } from 'react'
import { Check, Eye, Feather, RotateCcw, Waves } from 'lucide-react'
import Couple from '../components/Couple.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { packReply } from '../invite.js'
import { clip, WISH_MAX } from '../krathong.js'
import { randomId } from '../room/crypto.js'
import { createGuest } from '../room/link.js'
import { connectTransport } from '../room/transport.js'
import { useEnded } from '../useEnded.js'

export default function Guest({ invite, onFloat }) {
  const [link] = useState(() => createGuest({
    id: randomId(),
    connect: (handlers) => connectTransport(invite.secret, handlers),
  }))
  const { delivered } = useSyncExternalStore(link.subscribe, link.getState)
  const [step, setStep] = useState('read')
  const [wish, setWish] = useState('')
  const floating = step === 'float'
  const ended = useEnded(floating)

  useEffect(() => {
    link.open()
    return link.close
  }, [link])
  useEffect(() => onFloat(floating), [floating, onFloat])

  const submit = (event) => {
    event.preventDefault()
    const text = wish.trim()
    if (!text) return
    document.activeElement?.blur()
    window.scrollTo({ top: 0 })
    setWish(text)
    link.float(text)
    setStep('float')
  }

  const again = () => {
    link.again()
    setWish('')
    setStep('write')
  }

  return (
    <div className={floating ? 'play floating' : 'play'}>
      <Couple invite={invite} reply={wish} typing={step === 'write'} floating={floating} />
      <div className="foot" inert={floating}>
        <div>
          {step === 'read' && (
            <button className="primary" type="button" onClick={() => setStep('write')}><Feather size={20} aria-hidden="true" />ตาเธอขอบ้าง</button>
          )}
          {step !== 'read' && (
            <form className="panel" onSubmit={submit}>
              <p className="note" id="warn"><Eye size={22} aria-hidden="true" />อธิฐานดีๆเด้อ เค้าเห็นหมดทุกคำที่เธอพิมพ์</p>
              <textarea
                rows="2" aria-label="คำขอของเธอ" aria-describedby="warn" placeholder="ขอให้…" value={wish}
                onChange={(e) => setWish(clip(e.target.value, WISH_MAX))}
              />
              <button className={wish.trim() ? 'primary' : 'primary waiting'} type="submit" disabled={!wish.trim()}>
                <Waves size={20} aria-hidden="true" />ลอย
              </button>
            </form>
          )}
        </div>
      </div>
      {ended && (
        <div className="end">
          {delivered
            ? <p className="status" role="status"><Check size={18} aria-hidden="true" />ส่งถึง{invite.host}แล้ว</p>
            : <ShareButton hash={packReply(invite, wish)}>ส่งให้{invite.host}ดู</ShareButton>}
          <button className="ghost" type="button" onClick={again}><RotateCcw size={18} aria-hidden="true" />ลอยอีก</button>
        </div>
      )}
    </div>
  )
}
