import React from 'react'

import { Outlet, Route, Routes } from 'react-router-dom'

import { useSpotifyAuthCallback } from '@/hooks/useSpotifyAuthCallback'

import AuthGuard from '@/components/Auth/AuthGuard'
import ByYearPlaylists from '@/components/Playlists/ByYearPlaylists'
import DiscoverWeeklyPlaylist from '@/components/Playlists/DiscoverWeeklyPlaylist/DiscoverWeeklyPlaylist'
import FavoritePlaylists from '@/components/Playlists/FavoritePlaylists/FavoritePlaylists'
import PlaylistsLayout from '@/components/Playlists/PlaylistsLayout'
import ShazamPlaylist from '@/components/Playlists/ShazamPlaylist/ShazamPlaylist'
import SpecialPlaylists from '@/components/Playlists/SpecialPlaylists'
import YourTopPlaylists from '@/components/Playlists/YourTopPlaylists'
import DevNotes from '@/components/shared/DevNotes'
import NotFoundPage from '@/components/shared/NotFoundPage'

import AlbumPage from '@/pages/AlbumDetail'
import Albums from '@/pages/AlbumsPage'
import ArtistPersonPage from '@/pages/ArtistPersonPage'
import ArtistsPage from '@/pages/ArtistsPage'
import FeatureStats from '@/pages/FeatureStats'
import FollowedArtistsPage from '@/pages/FollowedArtistsPage'
import LibraryPage from '@/pages/LibraryPage'
import Login from '@/pages/Login'
import MissingTracksPage from '@/pages/MissingTracksPage'
import PlaylistPage from '@/pages/PlaylistDetail'
import TrackPage from '@/pages/TrackDetail'
import TracksPage from '@/pages/TracksPage'
import User from '@/pages/User'

import Header from './components/Header/Header'
import Footer from './components/shared/Footer'
import { ThemeProvider } from './contexts/ThemeProvider'
import './globals.css'
import Artist from './pages/ArtistDetail'
import GenresFinder from './pages/GenresFinder'
import Genres from './pages/GenresPage'
import Homepage from './pages/Homepage'
import Playlists from './pages/PlaylistsPage'
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
                <Route path="following" element={<FollowedArtistsPage />} />
                <Route path="person/:memberId" element={<ArtistPersonPage />} />
                <Route path=":artistId" element={<Artist />} />
              </Route>
              <Route path="/albums">
                <Route index element={<Albums />} />
                <Route path=":albumId" element={<AlbumPage />} />
              </Route>
              <Route path="/tracks">
                <Route index element={<TracksPage />} />
                <Route path="feature-stats" element={<FeatureStats />} />
                <Route path="missing-tracks" element={<MissingTracksPage />} />
                <Route path=":trackId">
                  <Route index element={<TrackPage />} />
                </Route>
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

              <Route path="/library" element={<LibraryPage />} />
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
