import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/mali/thai-400.css'
import '@fontsource/mali/thai-700.css'
import '@fontsource/mali/latin-400.css'
import '@fontsource/mali/latin-700.css'
import './index.css'
import App from './App.jsx'

// วางลิงก์ห้องใหม่ในแท็บเดิม = เริ่มใหม่ทั้งหน้า
window.addEventListener('hashchange', () => window.location.reload())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
