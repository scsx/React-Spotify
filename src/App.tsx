// import Button from './components/Button'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeProvider'

import Header from './components/Header'
import Homepage from './pages/Homepage'

import './globals.css'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Header />
      <Routes>
        <Route path='/' element={<Homepage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
