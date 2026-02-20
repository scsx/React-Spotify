import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TDiscogsArtist, TDiscogsError } from '@/types/Discogs'

import Hyperlink from '@/components/shared/Hyperlink'
import Loading from '@/components/shared/Loading'
import Text from '@/components/shared/Text'
import IconBrand from '@/components/shared/icons/IconBrand'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { getDiscogsArtist } from '@/services/discogs/getDiscogsArtist'

import { getDiscogsArtistPageUrl } from '@/lib/get-discogs-artist-page-url'

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
      <div className="container mb-2 pt-32">
        <Loading />
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
      <div className="flex gap-x-16 mt-16">
        <div className="w-1/3">
          {artist.images && artist.images.length > 0 && (
            <div className="w-full mb-8">
              <AspectRatio ratio={1}>
                <img
                  src={artist.images[0].uri}
                  alt={artist.name}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          )}
        </div>
        <div className="w-2/3">
          <Text variant="h1" className="mb-16">
            {artist.name}
          </Text>
          {artist.profile && (
            <>
              <Text variant="h2">Profile</Text>
              <Text className="mt-4">{artist.profile}</Text>
            </>
          )}
          <Hyperlink
            external
            href={`https://www.google.com/search?q=${encodeURIComponent(artist.name)}`}
            variant="icon"
            className="flex items-center gap-x-2 mt-8"
          >
            <IconBrand type="google" className="text-inherit" /> Google
          </Hyperlink>
          {artist.urls && artist.urls.length > 0 && (
            <div className="mt-8">
              <Text variant="h2">Links</Text>
              <div className="mt-4 flex flex-col gap-2">
                <Hyperlink external href={getDiscogsArtistPageUrl(artist.resource_url)}>
                  {getDiscogsArtistPageUrl(artist.resource_url)}
                </Hyperlink>
                {artist.urls.map((url, index) => (
                  <Hyperlink key={index} external href={url}>
                    {url}
                  </Hyperlink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Person
