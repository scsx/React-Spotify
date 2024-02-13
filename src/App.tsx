// import Button from './components/Button'
import { Routes, Route } from 'react-router-dom'

import Homepage from './pages/Homepage'
import Login from './pages/Login'

import './App.css'

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
