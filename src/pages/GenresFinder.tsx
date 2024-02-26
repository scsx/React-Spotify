import { getGenreSeeds } from '@/services/SpotifyGetAvailableGenreSeeds'
import searchSpotify from '@/services/SpotifySearch'

const GenresFinder = (): JSX.Element => {
  
  const permWave = "american shoegaze"
  const permWave2 = "american shoegaze,brooklyn indie"
// american post-punkamerican shoegazebrooklyn indienoise popnu gazeshoegaze
  async function fetchGenreArtists() {
    const results = await searchSpotify('', 'artist', permWave2)
    console.log(results)
  }

  fetchGenreArtists()

  return (
    <div className='container flex flex-col flex-1 justify-center'>
      <h1>Genres</h1>
    </div>
  )
}

export default GenresFinder
