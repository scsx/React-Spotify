import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import searchSpotify from '@/services/SpotifySearch'
import { SpotifyArtist } from '@/types/SpotifyArtist'

import HeadingOne from '@/components/HeadingOne'
import CardArtist from '@/components/CardArtist'

const GenresFinder = (): JSX.Element => {
  const initialArtistState: SpotifyArtist[] = []
  const { genresNames } = useParams()

  const [spotifyGenres, setSpotifyGenres] = useState<string[]>([])
  const [lastFmGenres, setLastFmGenres] = useState<string[]>([])
  const [artistsSpotify, setArtistsSpotify] = useState(initialArtistState)

  // Get genres by params.
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

  // Search Spotify
  // E.g. with no query and two genres: https://api.spotify.com/v1/search?q=genre:nu-gaze,indie-punk&type=artist
  useEffect(() => {
    if (spotifyGenres.length > 0) {
      const formattedGenres = spotifyGenres.map((genre) => genre.replace(/\s+/g, '-')).join(',')
      async function fetchGenreArtists() {
        const results = await searchSpotify('', 'artist', formattedGenres)
        setArtistsSpotify(results.items as SpotifyArtist[])
      }

      fetchGenreArtists()
    }
  }, [spotifyGenres])

  return (
    <div className='container flex flex-col flex-1 justify-center'>
      <HeadingOne text='Genres' />
      {spotifyGenres.map((genre, index) => (
        <div key={index}>{genre}</div>
      ))}

      <h3>Results from Spotify</h3>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        {artistsSpotify.length > 0 &&
          artistsSpotify.map((artist, index) => (
            <CardArtist
              key={artist.id}
              artist={artist}
              classes={`mb-1 col-span-1 md:col-span-${index === 0 || index === 1 ? '2' : '1'}`}
            />
          ))}
      </div>
    </div>
  )
}

export default GenresFinder
