import { useToken } from '../contexts/TokenContext'
import { getGenreSeeds } from '@/services/SpotifyGetAvailableGenreSeeds'

const Genres = (): JSX.Element => {
  async function fetchGenreSeeds() {
    const genreSeeds = await getGenreSeeds()
    console.log(genreSeeds)
  }

  fetchGenreSeeds()

  return (
    <div className='container flex flex-col flex-1 justify-center'>
      <h1>Genres</h1>
    </div>
  )
}

export default Genres
