import Krathong from './Krathong.jsx'

const STARS = [
  [6, 12, 2], [14, 30, 1], [21, 8, 1], [29, 22, 2], [36, 11, 1], [44, 34, 1], [52, 7, 2],
  [59, 25, 1], [66, 13, 1], [88, 9, 2], [93, 31, 1], [82, 40, 1], [10, 46, 1], [38, 45, 1], [96, 18, 1],
]
const RIPPLES = [[12, 8, 70], [62, 14, 90], [30, 30, 110], [78, 38, 80], [6, 52, 130], [56, 60, 120]]
// ซ้าย%, ขนาด px, เวลาลอยขึ้น, เริ่มกลางทาง, ส่ายไปทางไหน
const LANTERNS = [
  [4, 30, 34, 4, 30], [12, 18, 46, 30, -20], [20, 40, 30, 17, 26], [29, 14, 52, 11, 18], [37, 24, 40, 33, -28],
  [46, 12, 56, 44, 16], [58, 16, 50, 21, -18], [65, 28, 38, 8, 24], [74, 44, 29, 22, -30], [82, 18, 48, 37, 20],
  [89, 34, 33, 13, -24], [96, 22, 42, 27, -18],
]
// บน%ของน้ำ, ขนาด, เวลาไหลผ่านจอ, เริ่มกลางทาง, หน้าตา (ไม่มีคำขอ)
const FLOATING = [
  [3, 26, 74, 12, { base: 'leaf', flower: 'marigold', color: 'yellow' }],
  [6, 22, 88, 50, { base: 'bread', flower: 'plumeria', color: 'white' }],
  [10, 30, 70, 60, { base: 'leaf', flower: 'lotus', color: 'lilac' }],
  [13, 34, 64, 27, { base: 'leaf', flower: 'plumeria', color: 'pink' }],
  [17, 38, 58, 46, { base: 'bread', flower: 'marigold', color: 'yellow' }],
  [22, 44, 52, 8, { base: 'leaf', flower: 'lotus', color: 'white' }],
]
const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315]
const FIREWORKS = [[18, 34, '#ff9fbe', 0], [80, 26, '#ffd27a', 1.1], [32, 16, '#c9b2ff', 2.3], [68, 42, '#9be8d8', 3.4]]

function Lantern() {
  return (
    <svg viewBox="0 0 60 84" aria-hidden="true">
      <path d="M12 8Q30-4 48 8L56 62Q30 74 4 62Z" fill="#ffb45c" />
      <path d="M24 4Q30 2 36 4L41 66Q30 70 19 66Z" fill="#ffd78f" />
      <path d="M4 62Q30 74 56 62L54 68Q30 80 6 68Z" fill="#d9743a" />
      <circle cx="30" cy="62" r="7" fill="#fff3c4" />
    </svg>
  )
}

export default function Scene({ celebrate = false, children }) {
  return (
    <div className="scene">
      <div className="sky" aria-hidden="true">
        {STARS.map(([x, y, size]) => (
          <i key={`${x}-${y}`} className="star" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${(x % 7) * 0.5}s` }} />
        ))}
        <div className="moon" />
        {celebrate && FIREWORKS.map(([x, y, color, delay]) => (
          <div key={x} className="firework" style={{ left: `${x}%`, top: `${y}%`, color, '--delay': `${delay + 2}s` }}>
            {SPARKS.map((r) => <span key={r} style={{ rotate: `${r}deg` }}><i /></span>)}
          </div>
        ))}
        <svg className="shore" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMax slice">
          <path fill="#2b2558" d="M0 120V82q40-24 74 0 30-34 70-4 36-26 70 6 60-22 110 4h60V66l14-10 12-34 4-14 4 14 12 34 14 10v24h44V70l10-8 8-22 3-10 3 10 8 22 10 8v20h90q40-20 76 0 30-30 72-4 34-28 76 2 40-22 78 2 34-24 72 0 34-26 70-2 44-22 76 4 60-30 140 0V120z" />
        </svg>
      </div>
      <div className="water" aria-hidden="true">
        <div className="moonlight" />
        {RIPPLES.map(([x, y, width]) => (
          <i key={`${x}-${y}`} className="ripple" style={{ left: `${x}%`, top: `${y}%`, width, animationDelay: `${-(x % 5)}s` }} />
        ))}
        {FLOATING.map(([top, size, time, start, look]) => (
          <div key={top} className="passing" style={{ top: `${top}%`, animationDuration: `${time}s`, animationDelay: `${-start}s` }}>
            <div className="krathong bob" style={{ width: size }}><Krathong krathong={look} /></div>
          </div>
        ))}
      </div>
      <div className="lanterns" aria-hidden="true">
        {LANTERNS.map(([x, size, time, start, sway]) => (
          <div key={x} className="lantern" style={{ left: `${x}%`, width: size, animationDuration: `${time}s`, animationDelay: `${-start}s`, '--sway': `${sway}px` }}>
            <Lantern />
          </div>
        ))}
      </div>
      <main className="stage">{children}</main>
    </div>
  )
}
