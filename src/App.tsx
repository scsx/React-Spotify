// import Button from './components/Button'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeProvider'

import Header from './components/Header'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'

import './globals.css'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-1 pt-40 pb-20'>
          <Routes>
            <Route path='/' element={<Homepage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
