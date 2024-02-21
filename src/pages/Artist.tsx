import { useState, useEffect } from 'react'
//import { useToken } from '../contexts/TokenContext'
import { useParams } from 'react-router-dom'

import { SpotifyArtist } from '@/types/SpotifyArtist'
import { getArtist } from '@/services/SpotifyGetArtist'

import HeadingOne from '@/components/HeadingOne'

const Artist = (): JSX.Element => {
  const { artistId } = useParams<string>()
  const [artist, setArtist] = useState<SpotifyArtist | null>(null)
  //const token = useToken()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (artistId) {
          const fetchedArtist = await getArtist(artistId)
          console.log(artistId)
          console.log(fetchedArtist)
          setArtist(fetchedArtist)
        }
      } catch (error) {
        console.error('Error fetching country details:', error)
      }
    }

    fetchData()
  }, [artistId])

  return (
    <div className='container flex flex-col flex-1 justify-center'>
      {artist && <HeadingOne text={artist.name} />}
      
    </div>
  )
}

export default Artist
