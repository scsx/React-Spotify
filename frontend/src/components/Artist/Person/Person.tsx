import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TDiscogsArtist, TDiscogsError } from '@/types/Discogs'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

import { getDiscogsArtist } from '@/services/discogs/getDiscogsArtist'

const Person = () => {
  const { memberId } = useParams<{ memberId: string }>()
  const [artist, setArtist] = useState<TDiscogsArtist | TDiscogsError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!memberId) return

    const fetchArtist = async () => {
      setIsLoading(true)
      try {
        const data = await getDiscogsArtist(memberId)
        setArtist(data)
        console.log('Discogs artist fetched:', data)
      } catch (error) {
        console.error('Error fetching artist:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtist()
  }, [memberId])

  if (isLoading) {
    return (
      <div className="container mb-2">
        <Text>Loading...</Text>
      </div>
    )
  }

  if (!artist || 'error' in artist) {
    return (
      <div className="container mb-2">
        <Text color="muted">Failed to load artist information.</Text>
      </div>
    )
  }

  return (
    <div className="container mb-2">
      <Text variant="h1">{artist.name}</Text>
      <div className="flex gap-x-16 mt-16">
        <div className="w-2/3">
          {artist.profile && (
            <>
              <Text variant="h2">Profile</Text>
              <Text className="mt-4">{artist.profile}</Text>
            </>
          )}
          {artist.urls && artist.urls.length > 0 && (
            <div className="mt-8">
              <Text variant="h2">Links</Text>
              <div className="mt-4 flex flex-col gap-2">
                {artist.urls.map((url, index) => (
                  <Hyperlink key={index} external href={url}>
                    {url}
                  </Hyperlink>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-1/3">
          <Text variant="h2">Related persons</Text>
          {artist.members && artist.members.length > 0 && (
            <div className="mt-8">
              {artist.members.map((member) => (
                <div key={member.id} className="mt-2">
                  <Text>{member.name}</Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Person
