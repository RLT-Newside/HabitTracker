import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import JHabits from './JHabits.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JHabits />
  </StrictMode>
)
