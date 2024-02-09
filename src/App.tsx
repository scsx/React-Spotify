// import Button from './components/Button'
import { useEffect, useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'

import { SpotifyArtist } from './types/SpotifyArtist'

import Homepage from './pages/Homepage'
import Login from './pages/Login'

import './App.css'


const App: React.FC = () => {
  /* const CLIENT_ID = '7fed2e2e70e947c0ae0c8872e7f1467a'
  const REDIRECT_URI = 'http://localhost:5173'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token' */

  

  //const [token, setToken] = useState('')

  

 

  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/' element={<Home />} /> */}
        {/* <Route path='/countries' element={<Outlet />}>
          <Route index element={<Countries />} />
          <Route path=':countryId' element={<Country />} />
        </Route>
        <Route path='/fullpage' element={<FullPage />} />
        <Route path='/all-blocks' element={<AllBlocks />} />
        <Route path='/life-expectancy' element={<LifeExpectancy />} />
        <Route path='/middle-ages-art' element={<MiddleAgesArt />} />
        <Route path='/video-gallery' element={<VideoGallery />} /> */}
        {/* 404 page */}
        {/* <Route path='*' element={<Error404 />} /> */}
      </Routes>
      

      
    </>
  )
}

export default App
