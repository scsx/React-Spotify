import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TokenProvider } from './contexts/TokenContext'
import App from './App.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/material'

const reactSpotifyTheme = createTheme({
  typography: {
    fontFamily: ['Gabarito', 'sans-serif'].join(',')
  },
  palette: {
    primary: {
      main: '#1DB954'
    },
    secondary: {
      main: '#191414'
    }
    /*
    background: {
      default: '#191414'
    }
    */
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={reactSpotifyTheme}>
      <TokenProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TokenProvider>
    </ThemeProvider>
  </React.StrictMode>
)
