import { useEffect, useState } from 'react'

import { TSpotifyArtist } from '@/types/SpotifyArtist'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

import { getSpotifyFollowedArtists } from '@/services/spotify/getSpotifyFollowedArtists'

const ArtistsFollowedPage = () => {
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
      } catch (error: any) {
        console.error('Error fetching followed artists:', error)
        setError(error.message || 'Failed to load followed artists.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchFollowedArtists()
  }, [])

  return (
    <div className="relative container">
      <Text variant="h1" className="mb-8">
        Followed Artists
      </Text>

      {isLoading ? (
        <Text className="text-gray-400">Loading followed artists...</Text>
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

export default ArtistsFollowedPage
