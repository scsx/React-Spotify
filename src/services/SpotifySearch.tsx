import axios from 'axios'
import { SpotifyArtist, SpotifySearchArtists } from '@/types/SpotifyArtist'

const searchSpotify = async (
  token: string,
  query: string,
  type: string
): Promise<SpotifyArtist[]> => {
  
  //let typeOfData = type === 'artist' ? SpotifySearchArtists : ''

  console.log(token, query, type)

  const { data }: { data: SpotifySearchArtists } = await axios.get(
    'https://api.spotify.com/v1/search',
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: query,
        type: type
      }
    }
  )

  const { items }: { items: SpotifyArtist[] } = data.artists

  return items
}

export default searchSpotify
