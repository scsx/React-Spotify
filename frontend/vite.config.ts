// frontend/vite.config.ts
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// The base URL for your backend API, read from frontend/.env
// It should be 'http://localhost:3001' in development.
const BACKEND_API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001' // Fallback for safety

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin('all')],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Vite's proxy helps bypass CORS issues in development
    proxy: {
      '/api/lastfm': {
        target: BACKEND_API_BASE_URL,
        changeOrigin: true,
        secure: false, // Set to true if your backend uses HTTPS in dev, false otherwise
      },
      // Proxy for Spotify authentication routes (e.g., /auth/spotify/login)
      '/auth/spotify': {
        target: BACKEND_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
      // Proxy for Spotify API routes (e.g., /api/spotify/current-user-top-artists)
      // This assumes your backend will have routes like /api/spotify/* that then call Spotify's API.
      '/api/spotify': {
        target: BACKEND_API_BASE_URL,
        changeOrigin: true,
        secure: false, // HTTP vs HTTPS - Dev only.
      },
      // You can also use a more generic /api proxy if all backend APIs use this prefix:
      /*
      '/api': {
        target: BACKEND_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
      */
    },
  },
})
