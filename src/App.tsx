import { Routes, Route, Outlet } from 'react-router-dom'

import { ThemeProvider } from './contexts/ThemeProvider'
import './services/axiosInterceptor'

import Header from './components/Header'
import Footer from './components/Footer'
import Homepage from './pages/HomepageSearchArtists'
import Playlists from './pages/Playlists'
import Artist from './pages/Artist'
import Genres from './pages/Genres'
import GenresFinder from './pages/GenresFinder'

import './globals.css'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex flex-1 py-40 content-stretch'>
          <Routes>
            <Route path='/' element={<Outlet />}>
              <Route index element={<Homepage />} />
              <Route path=':artistId' element={<Artist />} />
            </Route>
            {/* <Route path='/' element={<Homepage />} /> */}
            <Route path='/playlists' element={<Playlists />} />
            <Route path='/genres' element={<Outlet />}>
              <Route index element={<Genres />} />
              <Route path=':genresNames' element={<GenresFinder />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
