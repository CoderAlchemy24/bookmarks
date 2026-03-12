
import { createRoot } from 'react-dom/client'
import Providers from "./app/providers";
import AppRoutes from "./app/routes";
import './globals.css'



// Theme helpers: apply saved theme, fallback to OS preference
const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  
}

const saved = localStorage.getItem('theme')
if (saved === 'dark' || saved === 'light') {
  applyTheme(saved)
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  applyTheme('dark')
}

createRoot(document.getElementById('root')).render(
  <Providers>
    <AppRoutes />
  </Providers>
)
