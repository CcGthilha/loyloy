import { useEffect, useState } from 'react'

const SAIL_TIME = 10500

export function useEnded(floating) {
  const [ended, setEnded] = useState(false)
  useEffect(() => {
    if (!floating) return undefined
    const timer = setTimeout(() => setEnded(true), SAIL_TIME)
    return () => {
      clearTimeout(timer)
      setEnded(false)
    }
  }, [floating])
  return ended
}
