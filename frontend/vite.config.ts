import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

const EXPRESS_SERVER_PORT = 3001

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin('all')],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/lastfm': {
        target: `http://localhost:${EXPRESS_SERVER_PORT}`,
        changeOrigin: true,
      },
      // Se tiveres outras rotas de API que não sejam da Last.fm e que também devam ir para o backend,
      // podes adicioná-las aqui também, por exemplo:
      // '/api/spotify': {
      //   target: `http://localhost:${EXPRESS_SERVER_PORT}`,
      //   changeOrigin: true,
      // },
    },
  },
})
