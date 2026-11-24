import { useState } from 'react'
import Scene from './components/Scene.jsx'
import { readRoute, saveMine } from './invite.js'
import Create from './pages/Create.jsx'
import Guest from './pages/Guest.jsx'
import { Replay, Watch } from './pages/Watch.jsx'

export default function App() {
  const [route, setRoute] = useState(() => readRoute(window.location.hash))
  const [celebrate, setCelebrate] = useState(false)
  const { page, invite } = route

  const go = (next, hash) => {
    window.history.replaceState(null, '', hash || window.location.pathname + window.location.search)
    setCelebrate(false)
    setRoute(next)
  }
  const made = (mine) => {
    saveMine(mine)
    go({ page: 'watch', invite: mine }, '#me')
  }
  const edit = () => go({ page: 'create', old: invite }, '')

  return (
    <Scene celebrate={celebrate}>
      {page === 'create' && <Create old={route.old} broken={route.broken} onDone={made} />}
      {page === 'guest' && <Guest invite={invite} onFloat={setCelebrate} />}
      {page === 'watch' && <Watch invite={invite} onEdit={edit} onFloat={setCelebrate} />}
      {page === 'replay' && <Replay invite={invite} reply={route.reply} onFloat={setCelebrate} />}
    </Scene>
  )
}
