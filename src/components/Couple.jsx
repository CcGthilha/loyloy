import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Krathong from './Krathong.jsx'

const OURS = { base: 'leaf', flower: 'lotus', color: 'pink' }
const LOOKS = {
  left: { hair: '#3b2230', shine: '#5d3a4b', dress: '#f07f9f', sash: '#ffc2d1', skirt: '#b4486f', hem: '#8f3359', skin: '#ffe0c7', shade: '#f6c9aa' },
  right: { hair: '#5a3524', shine: '#7d4f38', dress: '#8f7be0', sash: '#d5c8ff', skirt: '#5646a0', hem: '#43357f', skin: '#ffe0c7', shade: '#f6c9aa' },
}

// วาดหันขวาเข้าหากระทง ฝั่งขวาใช้ตัวเดียวกันกลับด้าน
function Girl({ look, bun }) {
  return (
    <g className="girl">
      {bun ? (
        <g>
          <circle cx="70" cy="40" r="27" fill={look.hair} />
          <path d="M54 34Q66 22 82 26" fill="none" stroke={look.shine} strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : (
        <path d="M60 70Q30 150 46 222Q72 240 100 216L112 96Z" fill={look.hair} />
      )}
      <g className="arm arm-hold">
        <path d="M128 172Q164 176 204 194" fill="none" stroke={look.shade} strokeWidth="15" strokeLinecap="round" />
      </g>
      <path d="M44 300Q34 238 82 214H150Q196 238 204 300Z" fill={look.skirt} />
      <path d="M44 300L43 284Q120 300 202 284L204 300Z" fill={look.hem} />
      <path d="M84 222Q78 166 102 148H136Q156 164 152 222Z" fill={look.dress} />
      <path d="M98 151L128 147Q148 176 152 214L136 220Q122 186 88 170Q92 158 98 151Z" fill={look.sash} />
      <rect x="80" y="211" width="74" height="11" rx="5" fill="#ffcf6b" />
      <circle cx="122" cy="216" r="6" fill="#fff0b8" />
      <path d="M106 124H132V146Q119 158 106 146Z" fill={look.shade} />
      <g className="head">
        <ellipse cx="118" cy="86" rx="55" ry="52" fill={look.skin} />
        <path d="M62 112Q50 22 120 26Q182 28 176 92Q168 68 148 56Q126 74 98 70Q80 84 78 112Q70 122 62 112Z" fill={look.hair} />
        <path d="M84 46Q102 34 124 36" fill="none" stroke={look.shine} strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="74" cy="102" rx="9" ry="11" fill={look.shade} />
        <circle cx="74" cy="116" r="4" fill="#ffcf6b" />
        <g transform="translate(82 56)">
          {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cy="-9" rx="6" ry="8" fill={bun ? '#fff3e2' : '#ffd86b'} transform={`rotate(${r})`} />)}
          <circle r="5" fill={bun ? '#ffc861' : '#f5923d'} />
        </g>
        <g className="eyes-open" fill="#3a2230">
          <ellipse cx="120" cy="98" rx="6" ry="9" />
          <ellipse cx="156" cy="98" rx="5.5" ry="9" />
          <circle cx="122" cy="94" r="2.4" fill="#fff" />
          <circle cx="158" cy="94" r="2.2" fill="#fff" />
        </g>
        <path className="eyes-closed" d="M112 100Q120 92 128 100M149 100Q156 92 163 100" fill="none" stroke="#3a2230" strokeWidth="4" strokeLinecap="round" />
        <path d="M112 81Q119 76 126 80M150 80Q156 76 162 80" fill="none" stroke={look.hair} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="108" cy="114" rx="9" ry="6" fill="#ff9d9d" opacity=".65" />
        <ellipse cx="163" cy="113" rx="6" ry="6" fill="#ff9d9d" opacity=".65" />
        <path d="M132 115Q139 123 146 115" fill="none" stroke="#b8505c" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="arm arm-hold">
        <path d="M112 174Q146 214 206 206" fill="none" stroke={look.skin} strokeWidth="17" strokeLinecap="round" />
        <path d="M182 200L185 216" stroke="#ffcf6b" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="arm arm-wai">
        <path d="M112 174Q118 212 152 196" fill="none" stroke={look.skin} strokeWidth="17" strokeLinecap="round" />
        <path d="M152 200Q150 176 160 160Q170 178 164 202Z" fill={look.skin} stroke={look.shade} strokeWidth="2" strokeLinejoin="round" />
        <path d="M144 190L150 206" stroke="#ffcf6b" strokeWidth="5" strokeLinecap="round" />
      </g>
    </g>
  )
}

function Bubble({ side, name, children }) {
  return (
    <article className={`bubble ${side}`}>
      <h2>{name}</h2>
      <p className={children.length > 45 ? 'long' : undefined}>{children}</p>
    </article>
  )
}

export default function Couple({ invite, reply, typing, floating }) {
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
        <Bubble side="left" name={invite.host}>{invite.wish}</Bubble>
        {floating && reply && <Bubble side="right" name={invite.guest}>{reply}</Bubble>}
        {!floating && typing && <div className="bubble right dots" aria-hidden="true"><i /><i /><i /></div>}
      </div>
      <div className="figures">
        <svg viewBox="0 0 480 300" className="girls" aria-hidden="true">
          <g className="dock-art">
            <rect x="-2400" y="268" width="5280" height="3000" fill="#4a3048" />
            <rect x="-2400" y="268" width="5280" height="9" fill="#7a5167" />
            <path d="M-2400 318H2880M-2400 372H2880M-2400 430H2880M-2400 490H2880" stroke="#3a2439" strokeWidth="4" />
          </g>
          <Girl look={LOOKS.left} />
          <g transform="translate(480 0) scale(-1 1)"><Girl look={LOOKS.right} bun /></g>
        </svg>
        <div className="our-krathong"><div className="krathong bob"><Krathong krathong={OURS} /></div></div>
        <Heart className="meet" aria-hidden="true" />
        <div className="names"><span>{invite.host}</span><span>{invite.guest}</span></div>
      </div>
    </div>
  )
}
