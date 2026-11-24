const SKIN = '#ffe1c9'
const SKIN_SHADE = '#f7c9a8'
const INK = '#4a3038'

const LOOKS = {
  hoodie: {
    hair: '#4b3440', shine: '#6d5060',
    top: '#ffb3c7', topDark: '#f192ab', sleeve: '#ffb3c7', sleeveDark: '#f192ab',
    pants: '#8fb4e0', pantsDark: '#7299c9', shoe: '#ffffff', sole: '#d9cfd6',
  },
  varsity: {
    hair: '#26242e', shine: '#555164',
    top: '#63b899', topDark: '#4a9b7f', sleeve: '#fff4dc', sleeveDark: '#e6d5b3',
    pants: '#6d74a8', pantsDark: '#575e90', shoe: '#ffd66b', sole: '#e0ae3d',
  },
}

function HairBack({ look, long }) {
  return long
    ? <path d="M54 92Q40 176 56 226Q84 244 112 232Q146 240 166 222Q180 170 170 92Z" fill={look.hair} />
    : <path d="M54 88Q38 138 56 160Q84 170 112 162Q142 170 168 160Q186 138 170 88Z" fill={look.hair} />
}

function HairFront({ look, long }) {
  return long ? (
    <>
      <path d="M52 116Q38 32 112 32Q186 32 172 116Q166 108 164 88Q150 92 138 78Q128 92 108 80Q94 94 76 84Q66 96 64 114Q58 124 52 116Z" fill={look.hair} />
      <path d="M72 58Q88 42 112 42" fill="none" stroke={look.shine} strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(70 76) rotate(-14)">
        <path d="M0 0Q-18-14-19 0Q-18 14 0 0Q18-14 19 0Q18 14 0 0Z" fill="#ffd66b" />
        <circle r="5" fill="#ffb84d" />
      </g>
    </>
  ) : (
    <>
      <path d="M52 122Q36 32 112 32Q188 32 172 122Q164 112 163 92Q154 98 146 78Q124 98 92 88Q80 100 68 96Q66 114 60 126Q55 130 52 122Z" fill={look.hair} />
      <path d="M72 58Q88 42 112 42" fill="none" stroke={look.shine} strokeWidth="6" strokeLinecap="round" />
    </>
  )
}

function Top({ look, long }) {
  return (
    <>
      <path d="M66 252Q56 148 112 144Q168 148 160 252Q112 268 66 252Z" fill={look.top} />
      {long ? (
        <>
          <path d="M72 158Q112 186 154 158Q150 142 112 140Q76 142 72 158Z" fill={look.topDark} />
          <path d="M104 172V190M122 172V188" stroke="#fff4f7" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M100 146Q112 162 124 146L128 260Q112 264 96 260Z" fill="#fffaf0" />
          <path d="M65 238Q112 256 161 238V252Q112 268 66 252Z" fill={look.topDark} />
          <path d="M66 246Q112 262 160 246" fill="none" stroke="#fff4dc" strokeWidth="3" />
          <path d="M142 168l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="#ffd66b" />
        </>
      )}
    </>
  )
}

function Face() {
  return (
    <>
      <g className="eyes-open">
        <ellipse cx="106" cy="106" rx="6.5" ry="8" fill={INK} />
        <ellipse cx="148" cy="106" rx="6.5" ry="8" fill={INK} />
        <circle cx="108.5" cy="102.5" r="2.5" fill="#fff" />
        <circle cx="150.5" cy="102.5" r="2.5" fill="#fff" />
      </g>
      <path className="eyes-closed" d="M98 109Q106 99 114 109M140 109Q148 99 156 109" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="90" cy="121" rx="11" ry="7" fill="#ff9aa2" opacity=".6" />
      <ellipse cx="155" cy="121" rx="8" ry="6.5" fill="#ff9aa2" opacity=".6" />
      <path d="M120 119Q127 128 134 119" fill="none" stroke="#c9636b" strokeWidth="4" strokeLinecap="round" />
    </>
  )
}

// วาดหันขวาเข้าหากระทง ฝั่งขวาใช้ตัวเดียวกันกลับด้าน
export default function Girl({ kind }) {
  const look = LOOKS[kind]
  const long = kind === 'hoodie'
  const round = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <g className="girl">
      <HairBack look={look} long={long} />

      <g className="arm arm-hold">
        <path d="M138 180Q156 196 172 200" {...round} stroke={look.sleeveDark} strokeWidth="24" />
        <circle cx="186" cy="201" r="11" fill={SKIN_SHADE} />
      </g>

      <path d="M118 254Q150 250 174 258" {...round} stroke={look.pantsDark} strokeWidth="32" />
      <ellipse cx="190" cy="250" rx="14" ry="20" fill={look.sole} />
      <path d="M90 268Q130 262 164 272" {...round} stroke={look.pants} strokeWidth="36" />
      <ellipse cx="183" cy="268" rx="16" ry="23" fill={look.sole} />
      <ellipse cx="179" cy="268" rx="14" ry="22" fill={look.shoe} />
      <path d="M62 250Q58 290 92 288Q120 286 122 258Z" fill={look.pants} />

      <Top look={look} long={long} />

      <g className="head">
        <ellipse cx="112" cy="98" rx="59" ry="54" fill={SKIN} />
        <Face />
        <HairFront look={look} long={long} />
      </g>

      <g className="arm arm-hold">
        <path d="M86 184Q104 222 164 212" {...round} stroke={look.sleeveDark} strokeWidth="31" />
        <path d="M86 184Q104 222 164 212" {...round} stroke={look.sleeve} strokeWidth="27" />
        <circle cx="183" cy="210" r="12.5" fill={SKIN} />
      </g>
      <g className="arm arm-wai">
        <path d="M86 184Q96 222 132 204" {...round} stroke={look.sleeveDark} strokeWidth="31" />
        <path d="M86 184Q96 222 132 204" {...round} stroke={look.sleeve} strokeWidth="27" />
        <path d="M136 208Q130 184 144 168Q160 184 154 208Q145 216 136 208Z" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="2.5" />
      </g>
    </g>
  )
}
