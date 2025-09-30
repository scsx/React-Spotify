import { useCallback, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import Text from '@/components/Text'
import { Button } from '@/components/ui/button'

import { useAuth } from '@/contexts/AuthContext'

const Login = () => {
  const { authLink, checkAuthStatus } = useAuth()
  const navigate = useNavigate()

  const isPopupCallback = !!window.opener

  const handleLoginClick = useCallback(() => {
    // 1. Abre o pop-up
    const popup = window.open(
      authLink,
      'spotifyAuthPopup',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    )

    // 2. Inicia o Polling na janela principal para detetar o fecho do popup
    const checkPopup = setInterval(() => {
      // Função assíncrona para lidar com a lógica de verificação
      const checkStatusAndNavigate = async () => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup)

          // Espera pela verificação do estado de autenticação
          await checkAuthStatus()

          // Redireciona a janela principal após o sucesso
          navigate('/albums', { replace: true })
        }
      }

      checkStatusAndNavigate()
    }, 500)
  }, [authLink, checkAuthStatus, navigate])

  // Lógica de callback (executada apenas na janela pop-up)
  useEffect(() => {
    const handlePopupSuccess = async () => {
      if (isPopupCallback) {
        try {
          await checkAuthStatus()

          // Redireciona a janela principal e fecha o popup
          window.opener.location.href = '/albums'
          window.close()
        } catch (e) {
          console.error('ERRO DURANTE O CALLBACK. Redirecionando para HP:', e)
          window.opener.location.href = '/'
          window.close()
        }
      }
    }

    handlePopupSuccess()
  }, [checkAuthStatus, isPopupCallback])

  if (!isPopupCallback) {
    return (
      <div className="container flex flex-col items-center pt-32">
        <Text variant="h1" className="mb-16">
          Login
        </Text>
        <Button onClick={handleLoginClick} className="p-6">
          <Text as="span" variant="h6">
            Authenticate with Spotify
          </Text>
        </Button>
      </div>
    )
  }

  // Mensagem na janela pop-up
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Auth complete. Closing window...</p>
    </div>
  )
}

export default Login
