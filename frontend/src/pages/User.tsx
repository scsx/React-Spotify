import { useEffect, useState } from 'react'

import { TSpotifyUser } from '@/types/SpotifyUser'
import { twMerge } from 'tailwind-merge'

import ErrorDisplay from '@/components/ErrorDisplay'
import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import Text from '@/components/Text'

import { getSpotifyCurrentUserProfile } from '@/services/spotify/getSpotifyCurrentUser'

import { getFirstNameAndLastInitial } from '@/lib/get-first-name-and-last-initial'

const User = (): JSX.Element => {
  const [userProfile, setUserProfile] = useState<TSpotifyUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blur, setBlur] = useState<boolean>(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getSpotifyCurrentUserProfile()
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

  const toggleBlur = () => {
    setBlur((prevBlur) => !prevBlur)
  }

  if (loading) {
    return <Loading type="spinner" />
  }

  if (error) {
    return <ErrorDisplay message={error} title="Error loading user" />
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
          : userProfile?.product === 'premium' && (
              <div className="ml-4 mb-4 text-primary">PREMIUM</div>
            )}
      </div>
      {userProfile ? (
        <>
          <div className="flex gap-4">
            <div className="w-full lg:w-1/2">
              <div className="mb-8">
                <Text as="h2" variant="h3" className="font-bold mb-2">
                  Country
                </Text>
                <Text as="h2" variant="h2" color="primary">
                  {userProfile.country}
                </Text>
              </div>
              <div className="mb-8">
                <Text as="h2" variant="h3" className="font-bold mb-2">
                  Followers
                </Text>
                <Text as="h2" variant="h2" color="primary">
                  {userProfile.followers.total}
                </Text>
              </div>
              <div className="mb-8">
                <Text as="h2" variant="h3" className="font-bold mb-2">
                  Email <span className="text-sm ml-8">Click to remove blur</span>
                </Text>
                <Text as="h2" variant="h2" color="primary" className={twMerge(blur && 'blur-sm')}>
                  <button onClick={toggleBlur}>{userProfile.email}</button>
                </Text>
              </div>
              <div className="mb-8">
                <Text as="h2" variant="h3" className="font-bold mb-2">
                  Spotify
                </Text>
                <Text as="h2" variant="h2">
                  <Hyperlink href={userProfile.uri} external>
                    {userProfile.uri}
                  </Hyperlink>
                </Text>
              </div>
              <div className="mb-8">
                <Text as="h2" variant="h3" className="font-bold mb-2">
                  Web
                </Text>
                <Text as="h2" variant="h2">
                  <Hyperlink href={userProfile.external_urls.spotify} external>
                    {userProfile.external_urls.spotify}
                  </Hyperlink>
                </Text>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-end">
              <img
                src={userProfile.images[0].url}
                alt="User"
                className="-mt-14 blur-md rounded-full max-h-[300px] max-w-[300px]"
              />
            </div>
          </div>
        </>
      ) : (
        <Text variant="paragraph">No profile available...</Text>
      )}
    </div>
  )
}

export default User
