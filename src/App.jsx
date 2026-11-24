import { useEffect, useState } from 'react'
import Scene from './components/Scene.jsx'
import Guest from './pages/Guest.jsx'
import Inbox from './pages/Inbox.jsx'
import Replay from './pages/Replay.jsx'
import { readRoute } from './route.js'

export default function App() {
  const [route] = useState(() => readRoute(window.location.hash))
  const [celebrate, setCelebrate] = useState(false)

  // จำกุญแจไว้แล้ว เอาออกจากแถบที่อยู่ กันเผลอแชร์
  useEffect(() => {
    if (route.remembered) window.history.replaceState(null, '', '#me')
  }, [route])

  return (
    <Scene celebrate={celebrate}>
      {route.page === 'guest' && <Guest onFloat={setCelebrate} />}
      {route.page === 'inbox' && <Inbox secretKey={route.secretKey} onFloat={setCelebrate} />}
      {route.page === 'replay' && <Replay reply={route.reply} onFloat={setCelebrate} />}
    </Scene>
  )
}
