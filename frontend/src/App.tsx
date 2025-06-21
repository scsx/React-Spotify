import React from 'react'

import { Outlet, Route, Routes } from 'react-router-dom'

import { useSpotifyAuthCallback } from '@/hooks/useSpotifyAuthCallback'

import AuthGuard from '@/components/Auth/AuthGuard'

import ArtistsPage from '@/pages/ArtistsPage'

import Footer from './components/Footer'
import Header from './components/Header'
import { ThemeProvider } from './contexts/ThemeProvider'
import './globals.css'
import Artist from './pages/Artist'
import Genres from './pages/Genres'
import GenresFinder from './pages/GenresFinder'
import Homepage from './pages/Homepage'
import Playlists from './pages/Playlists'
import './services/axiosInterceptor'

const App: React.FC = () => {
  useSpotifyAuthCallback()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-1 py-40 content-stretch">
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route index element={<Homepage />} />
            </Route>
            <Route path="/artists" element={<AuthGuard />}>
              <Route index element={<ArtistsPage />} />
              <Route path=":artistId" element={<Artist />} />
            </Route>
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/genres" element={<Outlet />}>
              <Route index element={<Genres />} />
              <Route path=":genresNames" element={<GenresFinder />} />
            </Route>
            <Route path="*" element={<Homepage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
