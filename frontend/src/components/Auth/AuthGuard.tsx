import { useEffect } from 'react'

import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'

import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

const AuthGuard = () => {
  const { isLoggedIn, isAuthCheckComplete } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Verifica se a checagem inicial de autenticação terminou
    if (isAuthCheckComplete) {
      // Se não estiver logado, redireciona para a rota de login local
      if (!isLoggedIn) {
        console.log('User not authenticated. Redirecting to login page.')
        navigate(SPOTIFY_AUTH_LOGIN_PATH, { replace: true })
      }
    }
  }, [isLoggedIn, isAuthCheckComplete, navigate]) 

  // Impede a renderização de conteúdo (evita "flicker") enquanto a checagem inicial está em curso
  if (!isAuthCheckComplete) {
    return null
  }

  return isLoggedIn ? <Outlet /> : null
}

export default AuthGuard
