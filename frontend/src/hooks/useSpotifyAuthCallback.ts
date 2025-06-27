import { useEffect, useRef } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useToken } from '@/contexts/TokenContext'

export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useToken()

  const hasProcessedThisLoad = useRef(false)

  useEffect(() => {
    // Manter temporariamente comentado para debugging até ver os logs corretos.
    // if (hasProcessedThisLoad.current) {
    //   console.log('Frontend Debug: Hook já processado para este carregamento, a ignorar.');
    //   return
    // }

    console.log('Frontend Debug: useSpotifyAuthCallback useEffect acionado.')
    console.log('Frontend Debug: Objeto location atual:', location)
    console.log('Frontend Debug: Conteúdo atual de location.search:', location.search)
    console.log('Frontend Debug: Conteúdo atual de location.hash:', location.hash)

    let tokenData = null
    let isSpotifyCallback = false
    let redirectError = null // Para capturar o erro, se houver

    // --- Processar PARÂMETROS DE QUERY (access_token ou error) ---
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
      console.log('Frontend: Access Token found in URL search params.')
    } else if (errorFromSearch) {
      redirectError = errorFromSearch
      isSpotifyCallback = true // É um callback, mas com erro
      console.error(
        'Frontend: Erro no Callback do Spotify (backend - search param):',
        redirectError
      )
    }

    // --- Adicionalmente, processar PARÂMETROS DE HASH (especialmente para erros ou se Spotify redireciona assim) ---
    // Isto é para lidar com o '#error=state_mismatch' que estás a ver.
    if (!isSpotifyCallback && location.hash) {
      // Só verifica hash se não encontrou nada nos query params ainda
      const hashParams = new URLSearchParams(location.hash.substring(1)) // Remova o '#' inicial
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
        console.log('Frontend: Access Token found in URL hash.')
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
        console.log('Frontend: Token do Spotify processado e armazenado com sucesso.')
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
      console.log('Frontend: Navegado para a raiz e estado do histórico substituído (URL limpa).')
    } else {
      console.log('Frontend Debug: Nenhuma condição de callback do Spotify detetada.')
    }
  }, [location, setToken, navigate])
}
