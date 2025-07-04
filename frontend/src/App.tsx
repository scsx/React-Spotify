import React from 'react'

import { Outlet, Route, Routes } from 'react-router-dom'

import { useSpotifyAuthCallback } from '@/hooks/useSpotifyAuthCallback'

import AuthGuard from '@/components/Auth/AuthGuard'
import DevNotes from '@/components/DevNotes'
import NotFoundPage from '@/components/NotFoundPage'
import DiscoveryWeeklyPlaylist from '@/components/Playlists/DiscoveryWeeklyPlaylist/DiscoveryWeeklyPlaylist'
import FavoritePlaylists from '@/components/Playlists/FavoritePlaylists/FavoritePlaylists'
import PlaylistsLayout from '@/components/Playlists/PlaylistsLayout'

import ArtistsPage from '@/pages/ArtistsPage'
import User from '@/pages/User'

import Footer from './components/Footer'
import Header from './components/Header/Header'
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
            <Route path="/" element={<Homepage />} />
            <Route path="/dev-notes" element={<DevNotes />} />

            {/* AuthGuard for all except HP, Dev Notes */}
            {/* Nested routes: --- Order matters --- */}
            <Route element={<AuthGuard />}>
              <Route path="/artists">
                <Route index element={<ArtistsPage />} />
                <Route path=":artistId" element={<Artist />} />
              </Route>

              <Route path="/playlists" element={<PlaylistsLayout />}>
                <Route path="discovery-weekly" element={<DiscoveryWeeklyPlaylist />} />
                <Route path="favorites" element={<FavoritePlaylists />} />
                <Route index element={<Playlists />} />
              </Route>

              <Route path="/user" element={<User />} />
              <Route path="/genres" element={<Outlet />}>
                <Route index element={<Genres />} />
                <Route path=":genresNames" element={<GenresFinder />} />
              </Route>
            </Route>

            {/* Any non-found route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
