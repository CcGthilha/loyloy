const PETALS = {
  pink: ['#ff9fbe', '#f0749d'],
  yellow: ['#ffd86b', '#f5b13d'],
  white: ['#fff8ee', '#e7dccd'],
  lilac: ['#d3b8ff', '#a986e8'],
}
const BASE = {
  leaf: { back: '#3f7f4b', front: '#68ad5b', light: '#8fce74', bowl: '#4d9152' },
  bread: { back: '#b9793f', front: '#e0a866', light: '#f3cb93', bowl: '#cc8f4e' },
}
const FRONT = [28, 62, 100, 138, 172]
const BACK = [44, 80, 120, 156]

function Flower({ type, colors: [light, deep], x, y, size }) {
  const around = (count, draw) => Array.from({ length: count }, (_, i) => draw((360 / count) * i))
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      {type === 'lotus' && (
        <>
          {[-58, 58, -32, 32].map((r) => <path key={r} d="M0 8Q-11-6 0-24Q11-6 0 8Z" fill={deep} transform={`rotate(${r})`} />)}
          {[-16, 16, 0].map((r) => <path key={r} d="M0 8Q-9-6 0-24Q9-6 0 8Z" fill={light} transform={`rotate(${r})`} />)}
        </>
      )}
      {type === 'marigold' && (
        <>
          {around(10, (r) => <circle key={r} cy="-11" r="6" fill={deep} transform={`rotate(${r})`} />)}
          {around(7, (r) => <circle key={r} cy="-6" r="5" fill={light} transform={`rotate(${r})`} />)}
          <circle r="4" fill={deep} />
        </>
      )}
      {type === 'plumeria' && (
        <>
          {around(5, (r) => <path key={r} d="M0 0Q-13-8-4-20Q8-20 0 0Z" fill={light} stroke={deep} strokeWidth="1.2" transform={`rotate(${r})`} />)}
          <circle r="5" fill="#ffc861" />
        </>
      )}
    </g>
  )
}

export default function Krathong({ krathong }) {
  const base = BASE[krathong.base]
  const colors = PETALS[krathong.color]
  return (
    <svg className="krathong-art" viewBox="0 0 200 180" aria-hidden="true">
      {BACK.map((x) => <path key={x} d={`M${x - 20} 118L${x} 82L${x + 20} 118Z`} fill={base.back} />)}
      <ellipse cx="100" cy="114" rx="76" ry="20" fill={base.bowl} />
      <path d="M124 108L140 42" stroke="#c98a5b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="140" cy="42" r="3" fill="#ff8a5c" />
      <rect x="95" y="54" width="10" height="56" rx="4" fill="#fff3d6" />
      <g className="flame">
        <path d="M100 22Q113 40 100 54Q87 40 100 22Z" fill="#ffb84d" />
        <path d="M100 34Q106 44 100 52Q94 44 100 34Z" fill="#fff3c4" />
      </g>
      <Flower type={krathong.flower} colors={colors} x={46} y={106} size={1} />
      <Flower type={krathong.flower} colors={colors} x={154} y={106} size={1} />
      <Flower type={krathong.flower} colors={colors} x={76} y={114} size={1.15} />
      <Flower type={krathong.flower} colors={colors} x={124} y={114} size={1.15} />
      <Flower type={krathong.flower} colors={colors} x={100} y={118} size={1.05} />
      <path d="M24 120Q100 138 176 120L160 154Q100 170 40 154Z" fill={base.bowl} />
      {FRONT.map((x) => {
        const y = 152 - Math.abs(x - 100) * 0.12
        return (
          <g key={x}>
            <path d={`M${x - 20} ${y - 10}L${x} ${y - 36}L${x + 20} ${y - 10}L${x} ${y + 10}Z`} fill={base.front} />
            <path d={`M${x - 20} ${y - 10}L${x} ${y - 36}L${x} ${y + 10}Z`} fill={base.light} />
          </g>
        )
      })}
    </svg>
  )
}
