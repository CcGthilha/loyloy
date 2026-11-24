import { useEffect, useState, useSyncExternalStore } from 'react'
import { Pencil, RotateCcw } from 'lucide-react'
import Couple from '../components/Couple.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { packInvite } from '../invite.js'
import { createHost } from '../room/link.js'
import { connectTransport } from '../room/transport.js'
import { useEnded } from '../useEnded.js'

function waitingText({ status, here }, guest) {
  if (status === 'connecting') return 'กำลังเดินไปท่าน้ำ'
  if (status === 'offline') return 'สัญญาณหลุด กำลังต่อใหม่'
  return here ? `${guest}มาแล้ว` : `รอ${guest}อยู่ เปิดหน้านี้ไว้นะ`
}

export function Watch({ invite, onEdit, onFloat }) {
  const [link] = useState(() => createHost({ connect: (handlers) => connectTransport(invite.secret, handlers) }))
  const state = useSyncExternalStore(link.subscribe, link.getState)
  const floating = state.reply !== null
  const ended = useEnded(floating)
  useEffect(() => {
    link.open()
    return link.close
  }, [link])
  useEffect(() => onFloat(floating), [floating, onFloat])

  return (
    <div className={floating ? 'play floating' : 'play'}>
      <Couple key={state.reply?.key ?? 'wait'} invite={invite} reply={state.reply?.wish} typing={state.here} floating={floating} />
      <div className="foot" inert={floating}>
        <div className="foot-buttons">
          <p className="status" role="status">{waitingText(state, invite.guest)}</p>
          <ShareButton hash={packInvite(invite)}>ชวน{invite.guest}</ShareButton>
          <button className="ghost" type="button" onClick={onEdit}><Pencil size={18} aria-hidden="true" />แก้คำขอ</button>
        </div>
      </div>
      {ended && <div className="end"><button className="ghost" type="button" onClick={onEdit}><RotateCcw size={18} aria-hidden="true" />เขียนใหม่</button></div>}
    </div>
  )
}

export function Replay({ invite, reply, onFloat }) {
  useEffect(() => onFloat(true), [onFloat])
  return (
    <div className="play floating">
      <Couple invite={invite} reply={reply} floating />
      <div className="foot" />
    </div>
  )
}
