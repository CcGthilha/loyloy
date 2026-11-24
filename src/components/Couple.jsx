import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { OUR_WISH } from '../wish.js'
import Girl from './Girl.jsx'
import Krathong from './Krathong.jsx'

const OURS = { base: 'leaf', flower: 'lotus', color: 'pink' }

function Bubble({ side, children }) {
  return (
    <div className={`bubble ${side}`}>
      <p className={children.length > 55 ? 'long' : undefined}>{children}</p>
    </div>
  )
}

export default function Couple({ reply, typing, floating }) {
  const [released, setReleased] = useState(false)

  // รอแผงพิมพ์หุบก่อนค่อยปล่อยมือ
  useEffect(() => {
    if (!floating) return undefined
    const timer = setTimeout(() => setReleased(true), 1300)
    return () => {
      clearTimeout(timer)
      setReleased(false)
    }
  }, [floating])

  return (
    <div className={released ? 'couple released' : 'couple'}>
      <div className="bubbles">
        <Bubble side="left">{OUR_WISH}</Bubble>
        {floating && reply && <Bubble side="right">{reply}</Bubble>}
        {!floating && typing && <div className="bubble right dots" aria-hidden="true"><i /><i /><i /></div>}
      </div>
      <div className="figures">
        <svg viewBox="0 0 480 300" className="girls" aria-hidden="true">
          <g className="dock-art">
            <rect x="-2400" y="262" width="5280" height="3000" fill="#4a3048" />
            <rect x="-2400" y="262" width="5280" height="9" fill="#7a5167" />
            <path d="M-2400 318H2880M-2400 372H2880M-2400 430H2880M-2400 490H2880" stroke="#3a2439" strokeWidth="4" />
          </g>
          {/* ซ้าย = เรา (คำขอเราอยู่ฝั่งนี้), ขวา = เธอ */}
          <Girl kind="varsity" />
          <g transform="translate(480 0) scale(-1 1)"><Girl kind="hoodie" /></g>
        </svg>
        <div className="our-krathong"><div className="krathong bob"><Krathong krathong={OURS} /></div></div>
        <Heart className="meet" aria-hidden="true" />
      </div>
    </div>
  )
}
