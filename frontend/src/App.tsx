import React from 'react'

import { Outlet, Route, Routes } from 'react-router-dom'

import { useSpotifyAuthCallback } from '@/hooks/useSpotifyAuthCallback'

import AuthGuard from '@/components/Auth/AuthGuard'
import DevNotes from '@/components/DevNotes'
import NotFoundPage from '@/components/NotFoundPage'
import ByYearPlaylists from '@/components/Playlists/ByYearPlaylists'
import DiscoverWeeklyPlaylist from '@/components/Playlists/DiscoverWeeklyPlaylist/DiscoverWeeklyPlaylist'
import FavoritePlaylists from '@/components/Playlists/FavoritePlaylists/FavoritePlaylists'
import PlaylistsLayout from '@/components/Playlists/PlaylistsLayout'
import ShazamPlaylist from '@/components/Playlists/ShazamPlaylist/ShazamPlaylist'
import SpecialPlaylists from '@/components/Playlists/SpecialPlaylists'
import YourTopPlaylists from '@/components/Playlists/YourTopPlaylists'

import AlbumPage from '@/pages/AlbumPage'
import Albums from '@/pages/Albums'
import ArtistsFollowedPage from '@/pages/ArtistsFollowedPage'
import ArtistsPage from '@/pages/ArtistsPage'
import FeatureStats from '@/pages/FeatureStats'
import Login from '@/pages/Login'
import PlaylistPage from '@/pages/PlaylistPage'
import TrackPage from '@/pages/TrackPage'
import TracksPage from '@/pages/Tracks'
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
            <Route path="/auth/spotify/login" element={<Login />} />

            {/* AuthGuard for all except HP, Dev Notes */}
            {/* Nested routes: --- Order matters --- */}
            <Route element={<AuthGuard />}>
              <Route path="/artists">
                <Route index element={<ArtistsPage />} />
                <Route path="following" element={<ArtistsFollowedPage />} />
                <Route path=":artistId" element={<Artist />} />
              </Route>
              <Route path="/albums">
                <Route index element={<Albums />} />
                <Route path=":albumId" element={<AlbumPage />} />
              </Route>
              <Route path="/tracks">
                <Route index element={<TracksPage />} />
                <Route path=":trackId" element={<TrackPage />} />
                <Route path="feature-stats" element={<FeatureStats />} />
                {/*  <Route path=":trackId" element={<TrackPage />} /> */}
              </Route>
              <Route path="/playlists" element={<PlaylistsLayout />}>
                <Route path="favorites" element={<FavoritePlaylists />} />
                <Route path="special" element={<SpecialPlaylists />} />
                <Route path="by-year" element={<ByYearPlaylists />} />
                <Route path="your-top-songs" element={<YourTopPlaylists />} />
                <Route path="discover-weekly" element={<DiscoverWeeklyPlaylist />} />
                <Route path="shazam" element={<ShazamPlaylist />} />
                <Route index element={<Playlists />} />
              </Route>
              {/* Playlist detail outside <PlaylistsLayout /> */}
              <Route path="/playlists/:playlistId" element={<PlaylistPage />} />

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
