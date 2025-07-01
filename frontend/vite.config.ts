// frontend/vite.config.ts
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// Mantém se usares para outras env vars

// A base URL para a tua API backend, lida de frontend/.env
// Deve ser 'https://localhost:3001' em desenvolvimento AGORA QUE O BACKEND É HTTPS
// E o VITE_API_BASE_URL no .env do frontend DEVE ser https://localhost:3001
const BACKEND_API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://localhost:3001' // Fallback para segurança

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // ADICIONA ISTO: Habilita HTTPS automático para o Vite Dev Server
    EnvironmentPlugin('all'), // Mantém se usares para outras env vars
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Vite's proxy helps bypass CORS issues in development
    proxy: {
      // Como todas as tuas rotas de backend começam com /api ou /auth,
      // podemos usar um proxy mais genérico para todas elas.
      // A ordem pode ser importante se tiveres rotas mais específicas.
      // Vamos usar uma entrada de proxy mais abrangente para simplificar.
      '/api': {
        // Este proxy vai apanhar /api/lastfm e /api/spotify/*
        target: BACKEND_API_BASE_URL,
        changeOrigin: true,
        secure: false, // MUDA ISTO: Desabilita a verificação de certificado SSL para o proxy (APENAS PARA DEV/LOCALHOST)
        // É necessário porque o proxy interno do Vite/Node.js pode não confiar
        // automaticamente nos certificados mkcert como o navegador faz.
      },
      '/auth': {
        // Este proxy vai apanhar /auth/spotify/*
        target: BACKEND_API_BASE_URL,
        changeOrigin: true,
        secure: false, // MUDA ISTO: Desabilita a verificação de certificado SSL para o proxy (APENAS PARA DEV/LOCALHOST)
      },
      // NOTA: Se tivesses rotas como '/user' no backend que não começam com /api ou /auth,
      // precisarias de adicionar mais entradas de proxy ou usar uma abordagem diferente.
    },
  },
})
