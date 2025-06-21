import { useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useToken } from '@/contexts/TokenContext'

// Este hook encapsula a lógica de processamento do token da URL de callback do Spotify
export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useToken()

  useEffect(() => {
    // 1. Tenta processar o token do HASH da URL (ex: #access_token=...)
    if (location.hash) {
      const params = new URLSearchParams(location.hash.substring(1)) // Remove o '#'
      const accessToken = params.get('access_token')
      const expiresIn = params.get('expires_in')
      const tokenType = params.get('token_type')

      if (accessToken && expiresIn && tokenType) {
        console.log('Spotify token found in URL hash. Setting token and redirecting to homepage.')
        setToken({
          // Chamando o setToken do TokenContext
          accessToken,
          expiresIn: parseInt(expiresIn, 10),
          tokenType,
          obtainedAt: Date.now(), // Grava o timestamp de quando o token foi obtido
        })
        navigate('/', { replace: true }) // Redireciona para a raiz para limpar a URL e o histórico
        return // Sai do useEffect para evitar processamento adicional
      }
    }

    // 2. Tenta processar o token diretamente na PATH da URL (o seu caso: /500yQ6SXJF9GBKVZrEjgAs)
    const currentPath = location.pathname
    if (
      currentPath !== '/' &&
      !currentPath.startsWith('/artists/') &&
      !currentPath.startsWith('/genres') &&
      !currentPath.startsWith('/playlists') &&
      currentPath.length > 50 // Heurística: tokens são geralmente longos
    ) {
      const potentialToken = currentPath.substring(1) // Remove o '/' inicial

      console.log('Potentially found token in path. Setting a placeholder token and redirecting.')
      setToken({
        // Chamando o setToken do TokenContext
        accessToken: potentialToken,
        expiresIn: 3600, // Valor padrão, idealmente deveria vir do backend ou ser validado
        tokenType: 'Bearer', // Valor padrão
        obtainedAt: Date.now(),
      })
      navigate('/', { replace: true }) // Redireciona para a raiz para limpar a URL e o histórico
      return
    }
  }, [location, setToken, navigate]) 
}
