import { useEffect, useState } from 'react'

import { TSpotifyUser } from '@/types/SpotifyUser'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { getCurrentUserProfile } from '@/services/spotify/getSpotifyCurrentUser'

const getFirstNameAndLastInitial = (displayName: string | null | undefined): string => {
  if (displayName) {
    const parts = displayName.split(' ').filter(Boolean)
    if (parts.length === 0) {
      return ''
    }
    const firstName = parts[0]
    if (parts.length > 1) {
      const lastInitial = parts[parts.length - 1][0].toUpperCase()
      return `${firstName} ${lastInitial}.`
    }
    return firstName
  }
  return ''
}

const User = (): JSX.Element => {
  const [userProfile, setUserProfile] = useState<TSpotifyUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getCurrentUserProfile()
        setUserProfile(data.user)
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
      <div className="flex items-center mb-16">
        <Text variant="h1">
          {loading
            ? 'A Carregar...'
            : getFirstNameAndLastInitial(userProfile?.display_name) || 'User'}
        </Text>
        {loading
          ? null
          : userProfile?.product === 'premium' && <div className="ml-4 mb-4 text-primary">PREMIUM</div>}
      </div>
      {userProfile ? (
        <>
          <div className="mb-8">
            <Text as="h2" variant="h2" className="mb-2">
              Country
            </Text>
            <Text as="h2" variant="h2" color="primary">
              {userProfile.country}
            </Text>
          </div>
          <div className="mb-8">
            <Text as="h2" variant="h2" className="mb-2">
              Followers
            </Text>
            <Text as="h2" variant="h2" color="primary">
              {userProfile.followers.total}
            </Text>
          </div>
          <div className="mb-8">
            <Text as="h2" variant="h2" className="mb-2">
              Email <span className="text-sm ml-8">Click to remove blur</span>
            </Text>
            <Text as="h2" variant="h2" color="primary" className="blur-sm">
              {userProfile.email}
            </Text>
          </div>
          <div className="mb-8">
            <Text as="h2" variant="h2" className="mb-2">
              Spotify
            </Text>
            <Text as="h2" variant="h2">
              <Hyperlink href={userProfile.uri} external>
                {userProfile.uri}
              </Hyperlink>
            </Text>
          </div>
          <div className="mb-8">
            <Text as="h2" variant="h2" className="mb-2">
              Web
            </Text>
            <Text as="h2" variant="h2">
              <Hyperlink href={userProfile.external_urls.spotify} external>
                {userProfile.external_urls.spotify}
              </Hyperlink>
            </Text>
          </div>

          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
            <code>{JSON.stringify(userProfile, null, 2)}</code>
          </pre>
        </>
      ) : (
        <Text variant="paragraph">No profile available...</Text>
      )}
    </div>
  )
}

export default User
