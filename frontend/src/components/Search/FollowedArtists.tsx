import { useEffect, useState } from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { getSpotifyFollowedArtists } from '@/services/spotify/getSpotifyFollowedArtists'

const FollowedArtists = () => {
  const [artists, setArtists] = useState<TSpotifyArtist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFollowedArtists = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getSpotifyFollowedArtists(50, undefined)
        setArtists(data.artists.items.slice(0, 20))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load followed artists.'
        console.error('Error fetching followed artists:', error)
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFollowedArtists()
  }, [])

  return (
    <div className="text-right">
      {isLoading ? (
        <Text className="text-gray-400">Loading followed artists...</Text>
      ) : error ? (
        <Text className="text-red-400">{error}</Text>
      ) : artists.length > 0 ? (
        <>
          <ul className="list-none space-y-1">
            {artists.map((artist) => (
              <li key={artist.id}>
                <Text variant="paragraph">
                  <Hyperlink href={`/artists/${artist.id}`} variant="icon">
                    {artist.name}
                  </Hyperlink>
                </Text>
              </li>
            ))}
          </ul>
          <Text className="mt-4">
            <Hyperlink href="/artists/following" variant="icon">
              See all
            </Hyperlink>
          </Text>
        </>
      ) : (
        <Text>No followed artists found.</Text>
      )}
    </div>
  )
}

export default FollowedArtists
