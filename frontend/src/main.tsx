import React from 'react'

import { BrowserRouter } from 'react-router-dom'

import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { TokenProvider } from './contexts/TokenContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
  </React.StrictMode>
)
