import { useEffect, useState } from 'react'

import { TSpotifyTrack } from '@/types/SpotifyTrack'
import { ImFire } from 'react-icons/im'

import Text from '@/components/Text'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import getSpotifyTopTracks from '@/services/spotify/getSpotifyTopTracks'

interface TopTracksProps {
  artistId: string
}

const TopTracks: React.FC<TopTracksProps> = ({ artistId }): JSX.Element => {
  const [topTracks, setTopTracks] = useState<TSpotifyTrack[] | null>(null)
  const [anyPopularTrack, setAnyPopularTrack] = useState<boolean>(false)

  useEffect(() => {
    const getTracks = async () => {
      try {
        const tracks = await getSpotifyTopTracks(artistId)
        setTopTracks(tracks)
        const foundPopular = tracks.some((track) => track.popularity > 70)
        setAnyPopularTrack(foundPopular)
      } catch (error) {
        console.error('Error fetching top tracks:', error)
      }
    }

    getTracks()
  }, [artistId])

  return (
    <div className="mb-14">
      <Text variant="h2" className="mb-4">
        Top Tracks
      </Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Album</TableHead>
            <TableHead className="text-right">Popularity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topTracks &&
            topTracks.map((track: TSpotifyTrack) => {
              return (
                <TableRow key={track.id}>
                  <TableCell className="font-medium">{track.name}</TableCell>
                  <TableCell>{track.album.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {track.popularity > 70 ? (
                        <ImFire className="text-xs mr-3 text-amber-500" />
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
      {anyPopularTrack && (
        <Text color="gray" className="flex items-center mt-4">
          <ImFire className="text-xs mr-2 text-amber-500" /> Popularity above 70
        </Text>
      )}
    </div>
  )
}

export default TopTracks
