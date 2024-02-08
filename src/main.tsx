import React from 'react'
import ReactDOM from 'react-dom/client'
import { TokenProvider } from './contexts/TokenContext'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TokenProvider>
      <App />
    </TokenProvider>
  </React.StrictMode>
)
