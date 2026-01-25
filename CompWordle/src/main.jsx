import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserInfoProvider from '../contexts/UserInfoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserInfoProvider>
      <App />
    </UserInfoProvider>
  </StrictMode>,
)
