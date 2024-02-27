import { useParams } from 'react-router-dom'
import searchSpotify from '@/services/SpotifySearch'
import { useEffect } from 'react'

const GenresFinder = (): JSX.Element => {
  let spotifyGenres: string[] = []
  let lastfmGenres: string[] = []

  const { genresNames } = useParams()

  if (genresNames) {
    const genres: string[] = genresNames.split(',').map((genre) => genre.trim())

    genres.forEach((genre) => {
      if (genre.startsWith('spotify:')) {
        spotifyGenres.push(genre.substring('spotify:'.length))
      } else if (genre.startsWith('lastfm:')) {
        lastfmGenres.push(genre.substring('lastfm:'.length))
      }
    })
  }

  let test: any = []

  // E.g. with no query and two genres: https://api.spotify.com/v1/search?q=genre:nu-gaze,indie-punk&type=artist
  useEffect(() => {
    if (spotifyGenres.length > 0) {
      const formattedGenres = spotifyGenres.map(genre => genre.replace(/\s+/g, '-')).join(',');
      async function fetchGenreArtists() {
        const results = await searchSpotify('', 'artist', formattedGenres)
        test = results.items
        console.log(results.items)
      }

      fetchGenreArtists()
    }
  }, [])

  useEffect(() => {}, [test])

  return (
    <div className='container flex flex-col flex-1 justify-center'>
      <h1>Genres</h1>
      {test && JSON.stringify(test)}
    </div>
  )
}

export default GenresFinder
