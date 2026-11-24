import { useEffect, useState, useSyncExternalStore } from 'react'
import { Check, Eye, Feather, RotateCcw, Waves } from 'lucide-react'
import Couple from '../components/Couple.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { createOutbox } from '../room/link.js'
import { connectTransport } from '../room/transport.js'
import { packReply } from '../route.js'
import { useEnded } from '../useEnded.js'
import { clip, OWNER_PUBLIC } from '../wish.js'

export default function Guest({ onFloat }) {
  const [box] = useState(() => createOutbox({ connect: connectTransport, publicKey: OWNER_PUBLIC }))
  const { delivered } = useSyncExternalStore(box.subscribe, box.getState)
  const [step, setStep] = useState('read')
  const [wish, setWish] = useState('')
  const floating = step === 'float'
  const ended = useEnded(floating)

  useEffect(() => {
    box.open()
    return box.close
  }, [box])
  useEffect(() => onFloat(floating), [floating, onFloat])

  const submit = (event) => {
    event.preventDefault()
    const text = wish.trim()
    if (!text) return
    document.activeElement?.blur()
    window.scrollTo({ top: 0 })
    setWish(text)
    box.float(text)
    setStep('float')
  }

  const again = () => {
    box.again()
    setWish('')
    setStep('write')
  }

  return (
    <div className={floating ? 'play floating' : 'play'}>
      <Couple reply={wish} typing={step === 'write'} floating={floating} />
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
                onChange={(e) => setWish(clip(e.target.value))}
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
            ? <p className="status" role="status"><Check size={18} aria-hidden="true" />ฝากถึงเค้าแล้ว</p>
            : <ShareButton hash={packReply(wish)}>ส่งให้เค้าดู</ShareButton>}
          <button className="ghost" type="button" onClick={again}><RotateCcw size={18} aria-hidden="true" />ลอยอีก</button>
        </div>
      )}
    </div>
  )
}
