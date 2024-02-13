// import Button from './components/Button'
import { Routes, Route } from 'react-router-dom'

import Homepage from './pages/Homepage'
import Login from './pages/Login'
// DELETE LATER
import PageWithDrawer from './pages/PageWithDrawer'

import './App.css'

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/drawer' element={<PageWithDrawer />} />
      </Routes>
    </>
  )
}

export default App
