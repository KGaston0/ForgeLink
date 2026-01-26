import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

// ============================================
// FORGELINK DESIGN SYSTEM
// Import order is important!
// ============================================
import './styles/variables.css'     // 1. CSS Variables first
import './styles/globals.css'       // 2. Global styles and reset
import './index.css'                // 3. Vite default styles (if needed)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
