const LOOKS = {
  hoodie: {
    hair: '#231b26', shine: '#4a3b4d', streak: '#9d6b83', skin: '#f6d3b8', shade: '#e3b594', lip: '#b9525c',
    top: '#e9e3dc', topDark: '#cfc6bd', sleeve: '#e9e3dc', sleeveFar: '#cfc6bd', cuff: '#bdb3a9',
    pants: '#7fa0c4', pantsDark: '#5f80a6', shoe: '#f4f1ec', sole: '#c7bfb6',
  },
  varsity: {
    hair: '#6b3f2a', shine: '#946046', streak: '#b98259', skin: '#f3cba9', shade: '#dcab85', lip: '#a94750',
    top: '#2f6b57', topDark: '#22503f', sleeve: '#efe6d4', sleeveFar: '#d4c8b2', cuff: '#2f6b57',
    pants: '#454b66', pantsDark: '#343953', shoe: '#e8e2da', sole: '#a64d4d',
  },
}

function Hair({ look, long }) {
  return long ? (
    <>
      <path d="M76 46Q50 130 58 226Q74 236 92 228L108 214L106 96Z" fill={look.hair} />
      <path d="M70 120Q62 176 68 230L78 231Q74 176 82 122Z" fill={look.streak} />
    </>
  ) : (
    <path d="M76 50Q58 92 64 124L54 136Q70 140 78 134L74 148Q94 142 104 124L104 70Z" fill={look.hair} />
  )
}

function Bangs({ look, long }) {
  return long ? (
    <>
      <path d="M74 82Q62 16 118 16Q170 18 157 92Q158 62 142 42L130 34Q118 42 100 50Q86 62 84 90Q80 100 76 100Z" fill={look.hair} />
      <path d="M152 52Q174 106 167 160Q160 166 154 158Q161 110 152 70Z" fill={look.hair} />
      <path d="M161 96Q166 128 162 158L157 157Q160 126 157 96Z" fill={look.streak} />
      <path d="M90 34Q104 24 122 25" fill="none" stroke={look.shine} strokeWidth="4" strokeLinecap="round" />
    </>
  ) : (
    <>
      <path d="M72 88Q60 14 118 14Q172 16 158 82L151 58L147 74L138 50L129 68L119 48L108 66L99 52Q86 66 86 92L80 108Q74 104 72 88Z" fill={look.hair} />
      <path d="M88 32Q104 20 124 23" fill="none" stroke={look.shine} strokeWidth="4" strokeLinecap="round" />
    </>
  )
}

function Top({ look, long }) {
  return (
    <>
      <path d="M70 240Q66 168 92 132Q116 122 140 132Q160 166 160 240Q116 254 70 240Z" fill={look.top} />
      {long ? (
        <>
          <path d="M90 134Q116 158 142 134Q136 120 116 122Q96 120 90 134Z" fill={look.topDark} />
          <path d="M106 146V172M126 146V166" stroke="#fffaf3" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 214H142L148 238Q122 246 94 238Z" fill={look.topDark} />
          <path d="M117 206C100 195 98 181 108 179C114 178 117 183 117 186C117 183 120 178 126 179C136 181 134 195 117 206Z" fill="#8d7ac7" />
        </>
      ) : (
        <>
          <path d="M106 128L118 152L130 128V244Q118 248 106 246Z" fill="#f7f3ec" />
          <path d="M106 128L112 246M130 128V244" stroke={look.topDark} strokeWidth="3" />
          <path d="M70 232Q116 250 160 232V242Q116 258 70 242Z" fill={look.topDark} />
          <path d="M71 238Q116 254 160 238" fill="none" stroke="#efe6d4" strokeWidth="2.5" />
          <path d="M145 168l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#efe6d4" />
        </>
      )}
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
      <Hair look={look} long={long} />

      <g className="arm arm-hold">
        <path d="M134 150Q152 178 182 190" {...round} stroke={look.sleeveFar} strokeWidth="21" />
        <path d="M180 189L186 192" {...round} stroke={look.cuff} strokeWidth="20" />
        <ellipse cx="196" cy="197" rx="10" ry="8" fill={look.shade} />
      </g>

      <path d="M96 244Q62 236 40 262Q52 288 130 284" {...round} stroke={look.pantsDark} strokeWidth="30" />
      <path d="M132 271Q160 266 168 284Q168 297 150 297H126Z" fill={look.shoe} />
      <path d="M126 292H168Q168 299 158 299H126Z" fill={look.sole} />
      <ellipse cx="120" cy="262" rx="52" ry="16" fill={look.pantsDark} />
      <path d="M116 242Q168 224 194 252Q190 276 112 282" {...round} stroke={look.pants} strokeWidth="32" />
      <path d="M150 238Q170 238 180 248" {...round} stroke={look.pantsDark} strokeWidth="3" />
      {long && <path d="M170 244l12 5M166 251l14 5" {...round} stroke="#dfe9f4" strokeWidth="3" />}
      {!long && <path d="M134 262h26v16h-26z" fill={look.pantsDark} />}
      <path d="M110 268Q80 266 70 282Q70 297 88 297H112Z" fill={look.shoe} />
      <path d="M70 292H112V299H80Q70 299 70 292Z" fill={look.sole} />
      <path d="M90 276l10 6M86 283l10 5" {...round} stroke={look.sole} strokeWidth="2.5" />

      <Top look={look} long={long} />
      <path d="M104 100H128V130Q117 142 104 132Z" fill={look.shade} />
      {long && <path d="M103 128Q116 138 129 127" {...round} stroke="#2c2430" strokeWidth="3" />}

      <g className="head">
        <path d="M78 64Q78 24 117 24Q156 24 155 66Q155 92 136 108Q124 118 111 110Q82 96 78 64Z" fill={look.skin} />
        <ellipse cx="85" cy="82" rx="7" ry="9" fill={look.shade} />
        {long
          ? <circle cx="84" cy="95" r="3" fill="#e9e3f5" />
          : <circle cx="84" cy="98" r="7" fill="none" stroke="#f3cf7a" strokeWidth="2.5" />}
        <g className="eyes-open" transform="translate(-4 0)">
          <ellipse cx="119" cy="78" rx="4.5" ry="5.5" fill="#33222b" />
          <ellipse cx="145" cy="78" rx="4" ry="5.5" fill="#33222b" />
          <circle cx="120.5" cy="76" r="1.5" fill="#fff" />
          <circle cx="146.5" cy="76" r="1.4" fill="#fff" />
          <path d="M109 77Q116 68 127 74M138 74Q145 69 152 76" {...round} stroke="#2a1b24" strokeWidth="3" />
          <path d="M109 77l-5-3" {...round} stroke="#2a1b24" strokeWidth="2.5" />
        </g>
        <path transform="translate(-4 0)" className="eyes-closed" d="M110 77Q118 83 126 78M139 78Q146 83 152 77M110 77l-5-2" {...round} stroke="#2a1b24" strokeWidth="3" />
        <path transform="translate(-4 0)" d="M108 63Q117 58 127 62M139 62Q146 58 152 62" {...round} stroke={look.hair} strokeWidth="3" />
        <path d="M134 82Q139 90 133 92" {...round} stroke={look.shade} strokeWidth="2.5" />
        <path d="M125 101Q133 105 141 100" {...round} stroke={look.lip} strokeWidth="3.5" />
        <ellipse cx="111" cy="91" rx="7" ry="4" fill="#e98a80" opacity=".28" />
        <Bangs look={look} long={long} />
        {!long && (
          <g>
            <path d="M70 66Q64 8 118 8Q166 10 160 54Q116 34 70 66Z" fill="#3d4468" />
            <path d="M67 60Q114 26 162 48L161 62Q116 42 70 74Z" fill="#525a85" />
            <rect x="128" y="46" width="16" height="11" rx="2" fill="#f0c766" transform="rotate(8 136 51)" />
          </g>
        )}
      </g>

      <g className="arm arm-hold">
        <path d="M94 152Q114 206 176 204" {...round} stroke={look.sleeveFar} strokeWidth="28" />
        <path d="M94 152Q114 206 176 204" {...round} stroke={look.sleeve} strokeWidth="24" />
        <path d="M174 204L183 204" {...round} stroke={look.cuff} strokeWidth="23" />
        <ellipse cx="196" cy="206" rx="11" ry="9" fill={look.skin} />
      </g>
      <g className="arm arm-wai">
        <path d="M94 152Q104 212 146 188" {...round} stroke={look.sleeveFar} strokeWidth="28" />
        <path d="M94 152Q104 212 146 188" {...round} stroke={look.sleeve} strokeWidth="24" />
        <path d="M143 190L150 184" {...round} stroke={look.cuff} strokeWidth="22" />
        <path d="M150 190Q146 164 157 144Q168 164 163 190Z" fill={look.skin} stroke={look.shade} strokeWidth="2" />
      </g>
    </g>
  )
}
