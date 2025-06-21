import { useEffect } from 'react'

import { Outlet, useNavigate } from 'react-router-dom'

import { useToken } from '@/contexts/TokenContext'

const AuthGuard = () => {
  const { isValid } = useToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isValid) {
      console.log('Token not found, redirecting to homepage.')
      navigate('/', { replace: true })
    }
  }, [isValid, navigate])

  return isValid ? <Outlet /> : null
}

export default AuthGuard
