import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import { FaSpotify } from 'react-icons/fa'
import { ImLastfm2 } from 'react-icons/im'

import CardArtist from '@/components/Artist/CardArtist'
import Text from '@/components/Text'
import { Badge } from '@/components/ui/badge'

import { getLastFMTagInfo } from '@/services/lastfm/getLastFMTagInfo'
import spotifySearch from '@/services/spotify/spotifySearch'

const GenresFinder = (): JSX.Element => {
  const initialArtistState: TSpotifyArtist[] = []
  const { genresNames } = useParams()
  const [spotifyGenres, setSpotifyGenres] = useState<string[]>([])
  const [lastFmGenres, setLastFmGenres] = useState<string[]>([])
  const [artistsSpotify, setArtistsSpotify] = useState(initialArtistState)
  const [lastFmTagsInfo, setLastFmTagsInfo] = useState<any[]>([])

  // Get genres from params.
  useEffect(() => {
    if (genresNames) {
      const allGenres: string[] = genresNames.split(',').map((genre) => genre.trim())

      const newSpotifyGenres: string[] = []
      const newLastFmGenres: string[] = []

      allGenres.forEach((genre) => {
        if (genre.startsWith('spotify:')) {
          newSpotifyGenres.push(genre.substring('spotify:'.length))
        } else if (genre.startsWith('lastfm:')) {
          newLastFmGenres.push(genre.substring('lastfm:'.length))
        }
      })

      setSpotifyGenres(newSpotifyGenres)
      setLastFmGenres(newLastFmGenres)
    }
  }, [genresNames])

  // Search for Spotify genres/tags.
  // E.g. with no query and two genres: https://api.spotify.com/v1/search?q=genre:nu-gaze,indie-punk&type=artist
  useEffect(() => {
    if (spotifyGenres.length > 0) {
      // Search Spotify.
      const fetchSpotifyArtistsByGenre = async () => {
        try {
          const formattedGenres = spotifyGenres.map((genre) => genre.replace(/\s/g, '-')).join(',')
          const results = await spotifySearch('', 'artist', formattedGenres)
          const artistsData = results.artists?.items as TSpotifyArtist[]
          setArtistsSpotify(artistsData)
        } catch (error) {
          console.error('Error searching Spotify artists by genre:', error)
        }
      }

      // Search LastFM.
      const fetchLastFmInfoForSpotifyGenres = async () => {
        const results: any[] = []
        for (const tag of spotifyGenres) {
          try {
            const lastFmResponse = await getLastFMTagInfo(tag)
            if (lastFmResponse && !lastFmResponse.error) {
              results.push(lastFmResponse.tag)
            } else {
              console.warn(
                `Could not get Last.FM info for Spotify genre '${tag}':`,
                lastFmResponse?.error
              )
            }
          } catch (error) {
            console.error(`Error fetching Last.FM info for Spotify genre '${tag}':`, error)
          }
        }
      }

      fetchSpotifyArtistsByGenre()
      fetchLastFmInfoForSpotifyGenres()
    }
  }, [spotifyGenres])

  // Search for LastFM genres/tags.
  useEffect(() => {
    if (lastFmGenres.length > 0) {
      const fetchLastFmTagsInfo = async () => {
        const results: any[] = []
        for (const tag of lastFmGenres) {
          try {
            const lastFmResponse = await getLastFMTagInfo(tag)
            if (lastFmResponse && !lastFmResponse.error) {
              results.push(lastFmResponse.tag)
            } else {
              console.warn(
                `Could not get Last.FM info for Last.FM genre '${tag}':`,
                lastFmResponse?.error
              )
            }
          } catch (error) {
            console.error(`Error fetching Last.FM info for Last.FM genre '${tag}':`, error)
          }
        }
        setLastFmTagsInfo(results)
      }

      fetchLastFmTagsInfo()
    }
  }, [lastFmGenres])

  return (
    <div className="container flex flex-col flex-1 justify-center">
      <Text variant="h1">Genres Finder</Text>
      <Text variant="h1">{genresNames}</Text>

      <div className="genres__results flex mt-4">
        <div className="genres__spotify flex-1 mr-4">
          <h3 className="text-xl mb-4">
            <FaSpotify className="inline-block text-primary mr-1" /> Spotify Results for{' '}
            {lastFmGenres.map((genre, index) => (
              <Badge key={index} variant="outline" className="font-normal text-sm">
                {genre}
              </Badge>
            ))}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {artistsSpotify.length > 0 &&
              artistsSpotify.map((artist) => (
                <CardArtist
                  key={artist.id}
                  artist={artist}
                  classes={`mb-1 col-span-2 md:col-span-1`}
                />
              ))}
          </div>
        </div>
        <div className="genres__lastfm flex-1 ml-4">
          <h3 className="text-xl mb-4">
            <ImLastfm2 className="inline-block text-red-500 mr-2" /> LastFM Results for{' '}
            {spotifyGenres.map((genre, index) => (
              <Badge key={index} variant="outline" className="font-normal text-sm">
                {genre}
              </Badge>
            ))}
          </h3>
          {lastFmTagsInfo.length > 0 ? (
            <div>
              {lastFmTagsInfo.map((tagInfo, index) => (
                <div key={index} className="mb-4 p-2 border rounded-md">
                  <h4 className="text-lg font-semibold">{tagInfo.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tagInfo.wiki?.summary || 'No summary available.'}
                  </p>
                  {tagInfo.wiki?.content &&
                    tagInfo.wiki.content.length > (tagInfo.wiki?.summary?.length || 0) && (
                      <a
                        href={tagInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Read more
                      </a>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p>No Last.FM info found for these genres.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenresFinder
