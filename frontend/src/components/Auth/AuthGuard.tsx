import { useEffect } from 'react'

import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'

const AuthGuard = () => {
  const { isLoggedIn, isAuthCheckComplete } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthCheckComplete) {
      if (!isLoggedIn) {
        console.log('Token not found, redirecting to homepage.')
        navigate('/', { replace: true })
      }
    }
  }, [isLoggedIn, navigate])

  return isLoggedIn ? <Outlet /> : null
}

export default AuthGuard
