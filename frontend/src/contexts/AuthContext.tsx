// frontend/src/contexts/AuthContext.tsx
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

// TODO: cleanup comments.

// Importar axios
import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

// Preservar o link de login

// Defina um tipo para informações básicas do usuário, se seu backend /api/spotify/me retornar
type TUser = {
  id: string
  display_name: string // Exemplo: o nome de exibição do usuário do Spotify
  email?: string
  // Adicione outros detalhes básicos do usuário que você possa obter do endpoint /me do seu backend
}

// Definição do tipo para o valor do contexto de autenticação
type TAuthContextValue = {
  isLoggedIn: boolean // Indica se o usuário está logado
  user: TUser | null // Informações do usuário logado
  checkAuthStatus: () => Promise<void> // Função para verificar o status de autenticação com o backend
  logout: () => void // Função para deslogar (chama o backend)
  authLink: string // O link para iniciar o login do Spotify (ainda útil para o botão)
}

// Crie o contexto
const AuthContext = createContext<TAuthContextValue | undefined>(undefined)

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<TUser | null>(null)
  const authLink = SPOTIFY_AUTH_LOGIN_PATH // O link para iniciar o login do Spotify

  // Função para verificar o status de autenticação com o backend
  const checkAuthStatus = useCallback(async () => {
    try {
      // Faz uma requisição para um endpoint protegido no seu backend (ex: /api/spotify/me).
      // Esta requisição enviará automaticamente o cookie 'connect.sid' (devido ao axios.defaults.withCredentials = true).
      const response = await axios.get('/api/spotify/me') // Este endpoint deve retornar 200 OK se logado
      if (response.status === 200) {
        setIsLoggedIn(true)
        setUser(response.data) // Assumindo que response.data contém as informações do usuário
        console.log('Frontend: Verificação de status de autenticação: Logado.')
      } else {
        // Esta situação é rara se o interceptor do axios lidar com 401, mas para segurança
        setIsLoggedIn(false)
        setUser(null)
        console.log(
          'Frontend: Verificação de status de autenticação: Não logado (resposta diferente de 200).'
        )
      }
    } catch (error) {
      // O interceptor do axios provavelmente irá capturar erros 401 e redirecionar.
      // Para outros erros, assumimos que não está logado.
      console.error('Frontend: Falha na verificação de status de autenticação:', error)
      setIsLoggedIn(false)
      setUser(null)
    }
  }, [])

  // Função para deslogar (chama o endpoint de logout do backend)
  const logout = useCallback(async () => {
    try {
      // Faz uma requisição POST para o endpoint de logout do seu backend.
      // VOCÊ PRECISARÁ IMPLEMENTAR ESTE ENDPOINT NO SEU BACKEND (ex: /auth/logout).
      // Este endpoint deve destruir a sessão no lado do backend (req.session.destroy()).
      await axios.post('/auth/logout') // Assumindo que o logout do seu backend está em /auth/logout
      setIsLoggedIn(false)
      setUser(null)
      console.log('Frontend: Deslogado com sucesso da sessão do backend.')
      // Após o logout no backend, redirecionar para a página de login
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH
    } catch (error) {
      console.error('Frontend: Falha ao deslogar no backend:', error)
      // Mesmo que o logout no backend falhe, limpe o estado do frontend para consistência
      setIsLoggedIn(false)
      setUser(null)
      // Redireciona mesmo se houve um erro no logout do backend
      window.location.href = SPOTIFY_AUTH_LOGIN_PATH
    }
  }, [])

  // Verifica o status de autenticação ao carregar o componente (e quando necessário)
  useEffect(() => {
    // Só verifica se não estiver logado, ou se os dados do usuário estiverem ausentes (carga inicial)
    if (!isLoggedIn || !user) {
      checkAuthStatus()
    }
  }, [isLoggedIn, user, checkAuthStatus]) // Adicionei user à lista de dependências para verificar novamente se os dados do usuário são nulos inicialmente

  // Memoiza o valor do contexto para evitar renderizações desnecessárias
  const contextValue = React.useMemo(
    () => ({
      isLoggedIn,
      user,
      checkAuthStatus,
      logout,
      authLink,
    }),
    [isLoggedIn, user, checkAuthStatus, logout, authLink]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
