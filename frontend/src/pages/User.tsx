import { useEffect, useState } from 'react'

import { TSpotifyUser } from '@/types/SpotifyUser'

import Text from '@/components/Text'

import { getCurrentUserProfile } from '@/services/spotify/getSpotifyCurrentUser'

const User = (): JSX.Element => {
  const [userProfile, setUserProfile] = useState<TSpotifyUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getCurrentUserProfile()
        setUserProfile(profile)
      } catch (err: any) {
        console.error('Erro ao buscar o perfil do utilizador:', err)
        setError(err.message || 'Ocorreu um erro ao carregar o perfil.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <Text variant="h2">A carregar perfil do utilizador...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <Text variant="h2">Erro ao carregar perfil</Text>
        <Text variant="paragraph">{error}</Text>
      </div>
    )
  }

  return (
    <div className="container">
      <Text variant="h1" className="mb-4">
        {loading ? 'Loading...' : `${userProfile?.display_name}`}
      </Text>
      {userProfile ? (
        // Exibe o objeto userProfile formatado como JSON para fácil visualização
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
          <code>{JSON.stringify(userProfile, null, 2)}</code>
        </pre>
      ) : (
        <Text variant="paragraph">Nenhum dado de perfil disponível.</Text>
      )}
    </div>
  )
}

export default User
