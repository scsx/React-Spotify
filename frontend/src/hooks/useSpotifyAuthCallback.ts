import { useEffect, useRef } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useToken } from '@/contexts/TokenContext'

export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useToken()

  const hasProcessedThisLoad = useRef(false)

  useEffect(() => {
    let tokenData = null
    let isSpotifyCallback = false
    let redirectError = null

    // --- query params (access_token or error) ---
    const searchParams = new URLSearchParams(location.search)
    const accessTokenFromSearch = searchParams.get('access_token')
    const expiresInFromSearch = searchParams.get('expires_in')
    const tokenTypeFromSearch = searchParams.get('token_type')
    const errorFromSearch = searchParams.get('error')

    if (accessTokenFromSearch && expiresInFromSearch) {
      tokenData = {
        accessToken: accessTokenFromSearch,
        expiresIn: parseInt(expiresInFromSearch, 10),
        tokenType: tokenTypeFromSearch || 'Bearer',
        obtainedAt: Date.now(),
      }
      isSpotifyCallback = true
    } else if (errorFromSearch) {
      redirectError = errorFromSearch
      isSpotifyCallback = true // É um callback, mas com erro
      console.error(
        'Frontend: Erro no Callback do Spotify (backend - search param):',
        redirectError
      )
    }

    // Deal with hash parameters # from Spotify errors.
    if (!isSpotifyCallback && location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1)) 
      const accessTokenFromHash = hashParams.get('access_token')
      const expiresInFromHash = hashParams.get('expires_in')
      const tokenTypeFromHash = hashParams.get('token_type')
      const errorFromHash = hashParams.get('error')

      if (accessTokenFromHash && expiresInFromHash) {
        tokenData = {
          accessToken: accessTokenFromHash,
          expiresIn: parseInt(expiresInFromHash, 10),
          tokenType: tokenTypeFromHash || 'Bearer',
          obtainedAt: Date.now(),
        }
        isSpotifyCallback = true
      } else if (errorFromHash) {
        redirectError = errorFromHash
        isSpotifyCallback = true // É um callback, mas com erro
        console.error(
          'Frontend: Erro no Callback do Spotify (browser/Spotify - hash param):',
          redirectError
        )
      }
    }

    if (isSpotifyCallback) {
      if (tokenData) {
        setToken(tokenData)
      } else {
        console.warn(
          'Frontend: Callback do Spotify processado, mas nenhum token válido encontrado (motivo: ',
          redirectError || 'desconhecido',
          ').'
        )
        // Aqui podes adicionar lógica para mostrar uma mensagem de erro ao utilizador
        // Ex: alert(`Erro no login: ${redirectError}`);
      }

      hasProcessedThisLoad.current = true // Marcar como processado

      // Limpar a URL completamente - remove search e hash
      navigate('/', { replace: true })
    }
  }, [location, setToken, navigate])
}
