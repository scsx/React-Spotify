// frontend/vite.config.ts
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

// Importar o módulo 'fs' para ler ficheiros
// import basicSsl from '@vitejs/plugin-basic-ssl'; // <--- REMOVA OU COMENTE ESTA LINHA
// import EnvironmentPlugin from 'vite-plugin-environment'; // Manter se ainda precisar de outras env vars

// A base URL para a tua API backend, lida de frontend/.env
// Agora deve ser 'https://spotify-clone.local:3001'
const BACKEND_API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://spotify-clone.local:3001'

// O caminho para a pasta 'certs' está dentro da pasta 'api'
// Se o vite.config.ts está em C:\DEV\React-Spotify
// e os certificados estão em C:\DEV\React-Spotify\api\certs
const certPath = path.resolve(__dirname, '../api', 'certs') // Ajuste este caminho se os seus certificados estiverem noutro local

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // EnvironmentPlugin('all'), // Manter se precisar
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Configurar host e porta para o novo domínio
    host: 'spotify-clone.local',
    port: 5173, // Mantenha a porta do frontend

    // Configurar HTTPS para usar os certificados mkcert
    https: {
      // Certifique-se que estes nomes correspondem EXATAMENTE aos seus ficheiros gerados pelo mkcert.
      // Ex: spotify-clone.local+1-key.pem e spotify-clone.local+1.pem
      key: fs.readFileSync(path.resolve(certPath, 'spotify-clone.local+1-key.pem')),
      cert: fs.readFileSync(path.resolve(certPath, 'spotify-clone.local+1.pem')),
    },

    // Vite's proxy helps bypass CORS issues in development
    proxy: {
      '/api': {
        target: BACKEND_API_BASE_URL, // Que agora é 'https://spotify-clone.local:3001'
        changeOrigin: true,
        secure: false, // Necessário para certificados autoassinados em desenvolvimento
      },
      '/auth': {
        target: BACKEND_API_BASE_URL, // Que agora é 'https://spotify-clone.local:3001'
        changeOrigin: true,
        secure: false, // Necessário para certificados autoassinados em desenvolvimento
      },
    },
  },
})
