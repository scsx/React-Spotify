import { useEffect, useRef } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useToken } from '@/contexts/TokenContext'

export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useToken()

  const hasProcessedThisLoad = useRef(false)

  useEffect(() => {
    /* console.log(
      'useSpotifyAuthCallback useEffect triggered. Location:',
      location.pathname,
      location.hash,
      'hasProcessedThisLoad.current:',
      hasProcessedThisLoad.current
    ) */

    if (hasProcessedThisLoad.current) {
      console.log('Skipping processing: Already handled for this load.')
      return
    }

    let tokenData = null
    let isSpotifyCallback = false

    // --- Check for token in URL Hash (Spotify's recommended way) ---
    if (location.hash && location.hash.includes('access_token=')) {
      const params = new URLSearchParams(location.hash.substring(1))
      const accessToken = params.get('access_token')
      const expiresIn = params.get('expires_in')
      const tokenType = params.get('token_type')

      if (accessToken && expiresIn && tokenType) {
        tokenData = {
          accessToken,
          expiresIn: parseInt(expiresIn, 10),
          tokenType,
          obtainedAt: Date.now(),
        }
        isSpotifyCallback = true
        console.log('Found Spotify token in URL hash.')
      }
    }

    // --- (Remova este bloco se você tem certeza que o token SEMPRE vem no hash) ---
    // Apenas mantenha se o seu backend ou outro provedor de auth realmente colocar tokens na URL path desta forma.
    const potentialPathTokenPattern = /^[a-zA-Z0-9_-]{50,}$/
    if (
      !tokenData &&
      location.pathname !== '/' &&
      potentialPathTokenPattern.test(location.pathname.substring(1))
    ) {
      if (
        !location.pathname.startsWith('/artists/') &&
        !location.pathname.startsWith('/genres') &&
        !location.pathname.startsWith('/playlists')
      ) {
        const potentialToken = location.pathname.substring(1)
        tokenData = {
          accessToken: potentialToken,
          expiresIn: 3600,
          tokenType: 'Bearer',
          obtainedAt: Date.now(),
        }
        isSpotifyCallback = true
        console.log('Found Spotify token in URL path (contingency).')
      }
    }

    // --- Process and redirect if a Spotify callback was detected ---
    if (isSpotifyCallback && tokenData) {
      setToken(tokenData)
      hasProcessedThisLoad.current = true // Mark as processed for this load

      // ***** A CHAVE PARA RESOLVER O LOOP: LIMPAR O HASH EXPLICITAMENTE *****
      // Isso deve ser feito APÓS setToken, mas ANTES ou JUNTO com o navigate.
      window.location.hash = '' // Isso modifica a URL no navegador e atualiza o 'location' do React Router

      // navega para a rota base, o `replace: true` impede que o hash fique no histórico
      navigate('/', { replace: true })
      console.log('Redirecting to homepage after token set and hash cleared.')
    } else if (location.pathname === '/' && !location.hash && !tokenData) {
      // Condição para resetar hasProcessedThisLoad se estiver na homepage limpa
      // e não houver token ou hash para processar.
      hasProcessedThisLoad.current = false
    }
  }, [location, setToken, navigate]) // Dependências permanecem as mesmas
}
