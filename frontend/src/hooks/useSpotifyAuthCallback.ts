import { useEffect, useRef } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'

// Importe o novo hook useAuth

export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { checkAuthStatus } = useAuth() // Use a função checkAuthStatus do seu AuthContext

  const hasProcessedThisLoad = useRef(false)

  useEffect(() => {
    let isSpotifyCallback = false
    let redirectError = null

    // Processar query params (erros, se houver)
    const searchParams = new URLSearchParams(location.search)
    const errorFromSearch = searchParams.get('error')

    if (errorFromSearch) {
      redirectError = errorFromSearch
      isSpotifyCallback = true // É um callback, mas com erro
      console.error(
        'Frontend: Erro no Callback do Spotify (backend - search param):',
        redirectError
      )
    }

    // Processar hash parameters (erros, se houver, geralmente do próprio Spotify)
    if (!isSpotifyCallback && location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1))
      const errorFromHash = hashParams.get('error')

      if (errorFromHash) {
        redirectError = errorFromHash
        isSpotifyCallback = true // É um callback, mas com erro
        console.error(
          'Frontend: Erro no Callback do Spotify (browser/Spotify - hash param):',
          redirectError
        )
      }
    }

    // Se o backend redirecionou para o URL de sucesso do frontend (e.g., '/')
    // e não há erro explícito na URL, consideramos o login bem-sucedido via sessão.
    // A condição `location.pathname === '/'` assume que sua URL de sucesso é a raiz do frontend.
    if (location.pathname === '/' && !redirectError) {
      isSpotifyCallback = true // Assume-se que o callback foi bem-sucedido se não houver erro
      console.log(
        'Frontend: Callback do Spotify processado. Assumindo login bem-sucedido via sessão.'
      )

      // DISPARA A VERIFICAÇÃO DE STATUS DE AUTENTICAÇÃO COM O BACKEND.
      // É o backend quem detém o token agora via sessão.
      checkAuthStatus()
    }

    // Lógica para executar apenas uma vez por carregamento/render
    if (isSpotifyCallback && !hasProcessedThisLoad.current) {
      if (redirectError) {
        console.warn('Frontend: Callback do Spotify processado, mas com erro: ', redirectError)
        // Aqui você pode adicionar lógica para exibir uma mensagem de erro ao usuário.
      } else {
        console.log('Frontend: Login Spotify bem-sucedido (token gerido pelo backend).')
        // O `checkAuthStatus()` acima já cuidou de atualizar o estado `isLoggedIn` no AuthContext.
      }

      hasProcessedThisLoad.current = true // Marcar como processado
      // Limpar a URL completamente - remove search e hash (parâmetros de autenticação)
      navigate('/', { replace: true }) // Redireciona para a página principal após o processamento
    }
  }, [location, checkAuthStatus, navigate]) // Adiciona checkAuthStatus às dependências
}
