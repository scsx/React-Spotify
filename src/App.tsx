// import Button from './components/Button'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeProvider'

import Homepage from './pages/Homepage'
import Login from './pages/Login'

import './App.css'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
