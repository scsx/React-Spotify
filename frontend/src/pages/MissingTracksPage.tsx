import Text from '@/components/shared/Text'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const MissingTracksPage = () => {
  const missingTracks = [
    {
      id: '4t7tGUQIm3BN6Q8BmBDjwn',
      artista: 'Aldrich Lawson',
      faixa: 'No Problem',
      album: 'Never Never',
    },
  ]

  return (
    <div className="container">
      <Text variant="h1">Missing tracks</Text>
      <div className="mt-16 flex gap-x-16">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artist</TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missingTracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>{track.artista}</TableCell>
                <TableCell>{track.faixa}</TableCell>
                <TableCell>{track.album}</TableCell>
                <TableCell className="font-mono text-sm">{track.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Text className="w-1/4 mt-4" color="muted">
          Albums or tracks that are missing from Spotify or are no longer available there.
        </Text>
      </div>
    </div>
  )
}

export default MissingTracksPage
