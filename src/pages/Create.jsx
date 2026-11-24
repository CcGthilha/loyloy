import { useState } from 'react'
import { Feather } from 'lucide-react'
import { clip, NAME_MAX, WISH_MAX } from '../krathong.js'
import { newSecret } from '../room/crypto.js'

export default function Create({ old, broken, onDone }) {
  const [host, setHost] = useState(old?.host ?? '')
  const [guest, setGuest] = useState(old?.guest ?? '')
  const [wish, setWish] = useState(old?.wish ?? '')

  const submit = (event) => {
    event.preventDefault()
    if (!wish.trim()) return
    onDone({ host: host.trim() || 'เค้า', guest: guest.trim() || 'เธอ', wish: wish.trim(), secret: newSecret() })
  }

  return (
    <div className="create">
      <h1>ลอยด้วยกันนะ</h1>
      <form className="panel" onSubmit={submit}>
        {broken && <p className="note" role="alert">ลิงก์ไม่ครบ ลองขอใหม่อีกทีนะ</p>}
        <div className="two">
          <label className="field"><span>ชื่อเค้า</span><input value={host} autoComplete="off" placeholder="เค้า" onChange={(e) => setHost(clip(e.target.value, NAME_MAX))} /></label>
          <label className="field"><span>ชื่อเธอ</span><input value={guest} autoComplete="off" placeholder="เธอ" onChange={(e) => setGuest(clip(e.target.value, NAME_MAX))} /></label>
        </div>
        <label className="field">
          <span>คำขอของเค้า</span>
          <textarea rows="3" required value={wish} placeholder="เธอจะเห็นข้อความนี้" onChange={(e) => setWish(clip(e.target.value, WISH_MAX))} />
        </label>
        <button className="primary" type="submit"><Feather size={20} aria-hidden="true" />ทำลิงก์</button>
      </form>
    </div>
  )
}
