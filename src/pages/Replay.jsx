import { useEffect } from 'react'
import Couple from '../components/Couple.jsx'

export default function Replay({ reply, onFloat }) {
  useEffect(() => onFloat(true), [onFloat])
  return (
    <div className="play floating">
      <Couple reply={reply} floating />
      <div className="foot" />
    </div>
  )
}
