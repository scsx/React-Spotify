import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import getTopTracks from '@/services/SpotifyGetTopTracks'
import { SpotifyTrack } from '@/types/SpotifyTrack'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ImFire } from 'react-icons/im'

interface TopTracksProps {
  artistId: string
}

const TopTracks: React.FC<TopTracksProps> = ({ artistId }): JSX.Element => {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[] | null>(null)

  useEffect(() => {
    const getTracks = async () => {
      try {
        const tracks = await getTopTracks(artistId)
        setTopTracks(tracks.items)
      } catch (error) {
        console.error('Error fetching top tracks:', error)
      }
    }

    getTracks()
  }, [])

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Album</TableHead>
            <TableHead className='text-right'>Popularity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topTracks &&
            topTracks.map((track: SpotifyTrack) => {
              return (
                <TableRow key={track.id}>
                  <TableCell className='font-medium'>{track.name}</TableCell>
                  <TableCell>{track.album.name}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end'>
                      {track.popularity > 70 ? (
                        <ImFire className='text-xs mr-3 text-gray-500' />
                      ) : (
                        ''
                      )}
                      {track.popularity}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
      <p className='flex items-center mt-4 text-sm text-gray-500'>
        <ImFire className='text-xs mr-2' /> Popularity &gt; 70
      </p>
    </>
  )
}

export default TopTracks
