import { useEffect, useMemo, useState } from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Hyperlink from '@/components/shared/Hyperlink'
import Loading from '@/components/shared/Loading'
import Text from '@/components/shared/Text'

import { getSpotifyFollowedArtists } from '@/services/spotify/getSpotifyFollowedArtists'

const FollowedArtistsPage = () => {
  const [artists, setArtists] = useState<TSpotifyArtist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFollowedArtists = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getSpotifyFollowedArtists(50, undefined)

        const sortedArtists = data.artists.items
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))

        setArtists(sortedArtists)
      } catch (err: unknown) {
        console.error('Error fetching followed artists:', err)

        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load followed artists.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowedArtists()
  }, [])

  const thePercentage = useMemo(() => {
    if (artists.length === 0) return 0

    const count = artists.filter((a) => a.name.toLowerCase().startsWith('the ')).length

    return Math.round((count / artists.length) * 100)
  }, [artists])

  return (
    <div className="relative container">
      <Text variant="h1">Followed Artists</Text>
      <Text variant="h4" color="muted" className="mt-2 mb-16">
        Artists starting with ‘The’: {thePercentage}%
      </Text>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <Text className="text-red-400">{error}</Text>
      ) : artists.length > 0 ? (
        <>
          <div className="grid grid-cols-5 gap-4">
            {artists.map((artist) => (
              <div key={artist.id}>
                <Text variant="paragraph">
                  <Hyperlink href={`/artists/${artist.id}`} variant="icon">
                    {artist.name}
                  </Hyperlink>
                </Text>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Text>No followed artists found.</Text>
      )}
    </div>
  )
}

export default FollowedArtistsPage
