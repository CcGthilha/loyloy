import { useEffect, useState } from 'react'
import { Check, Link } from 'lucide-react'

async function share(url) {
  if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
    try {
      await navigator.share({ title: 'ลอยด้วยกันนะ', url })
      return 'shared'
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    window.prompt('คัดลอกลิงก์นี้', url)
    return 'prompted'
  }
}

export default function ShareButton({ hash, children }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const onClick = async () => {
    const url = new URL(window.location.href)
    url.hash = hash
    if (await share(url.href) === 'copied') setCopied(true)
  }
  return (
    <button className="primary" type="button" onClick={onClick}>
      {copied ? <Check size={20} aria-hidden="true" /> : <Link size={20} aria-hidden="true" />}
      {copied ? 'คัดลอกแล้ว' : children}
    </button>
  )
}
