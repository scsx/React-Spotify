import { useEffect, useRef } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useToken } from '@/contexts/TokenContext'

export const useSpotifyAuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useToken() // Embora o setToken não vá definir o token A PARTIR DA URL agora,
  // ele ainda pode ser útil para indicar um estado de "logado"

  const hasProcessedThisLoad = useRef(false)

  useEffect(() => {
    // let tokenData = null; // Não precisamos mais de tokenData aqui
    let isSpotifyCallback = false
    let redirectError = null

    // --- Processar query params (APENAS ERROS) ---
    const searchParams = new URLSearchParams(location.search)
    // REMOVA: const accessTokenFromSearch = searchParams.get('access_token')
    // REMOVA: const expiresInFromSearch = searchParams.get('expires_in')
    // REMOVA: const tokenTypeFromSearch = searchParams.get('token_type')
    const errorFromSearch = searchParams.get('error')

    // Se houver um erro, é um callback
    if (errorFromSearch) {
      redirectError = errorFromSearch
      isSpotifyCallback = true // É um callback, mas com erro
      console.error(
        'Frontend: Erro no Callback do Spotify (backend - search param):',
        redirectError
      )
    }

    // --- Processar hash parameters (APENAS ERROS) ---
    // (Geralmente, o Spotify envia erros de autorização via hash, mas mantemos a verificação)
    if (!isSpotifyCallback && location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1))
      // REMOVA: const accessTokenFromHash = hashParams.get('access_token')
      // REMOVA: const expiresInFromHash = hashParams.get('expires_in')
      // REMOVA: const tokenTypeFromHash = hashParams.get('token_type')
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

    // --- Apenas se for um callback de login (sucesso ou erro) ---
    // Se o backend redirecionou para FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL, assumimos sucesso,
    // a menos que haja um 'error' na URL.
    // Se não há 'error' e o URL corresponde ao de sucesso, consideramos o login bem-sucedido via sessão.
    if (
      location.pathname === new URL(import.meta.env.VITE_API_BASE_URL).pathname &&
      !redirectError
    ) {
      // Isso assume que o FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL é a raiz ou uma rota específica
      // que este hook está a monitorizar para callbacks bem-sucedidos.
      // Se FRONTEND_SPOTIFY_LOGIN_SUCCESS_URL for algo como '/dashboard',
      // então a condição `location.pathname === '/dashboard'` seria mais adequada.
      isSpotifyCallback = true // Assume-se que o callback foi bem-sucedido se não houver erro
      console.log(
        'Frontend: Callback do Spotify processado. Assumindo login bem-sucedido via sessão.'
      )
      setToken({
        accessToken: 'session_based',
        expiresIn: 3600,
        tokenType: 'Bearer',
        obtainedAt: Date.now(),
      })
      // O `setToken` com valores dummy é apenas para sinalizar ao contexto que o utilizador está logado.
      // O token real está no backend.
    }

    if (isSpotifyCallback && !hasProcessedThisLoad.current) {
      if (redirectError) {
        console.warn('Frontend: Callback do Spotify processado, mas com erro: ', redirectError)
        // Aqui pode mostrar uma mensagem de erro mais amigável ao utilizador
        // Ex: alert(`Falha no login: ${redirectError}. Por favor, tente novamente.`);
      } else {
        // Se não há erro e é um callback (e não foi processado), significa sucesso.
        // Não há token para definir aqui, pois ele está no backend.
        // Apenas para fins de estado no frontend, pode setar um valor para 'logado'.
        console.log('Frontend: Login Spotify bem-sucedido (token gerido pelo backend).')
        // Você pode querer chamar uma função para buscar dados do usuário aqui para confirmar o login
        // ou simplesmente permitir que a navegação continue para a página principal.
      }

      hasProcessedThisLoad.current = true // Marcar como processado
      // Limpar a URL completamente - remove search e hash
      navigate('/', { replace: true }) // Redireciona para a página principal após o processamento
    }
  }, [location, setToken, navigate])
}
