import { TLibraryPlaylist } from '@/types/Library'

type TLibraryPLViewerProps = {
  playlists: TLibraryPlaylist[] | null | undefined
}

export default function LibraryPLViewer({ playlists }: TLibraryPLViewerProps) {
  if (!playlists || playlists.length === 0) {
    return <div>Nenhuma playlist disponível.</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4 pt-8">
      {playlists.map((pl) => (
        <div key={pl.id} className="p-3 border rounded-lg overflow-hidden">
          {pl.images && pl.images[0] && (
            <img
              src={pl.images[0].url}
              alt={pl.name}
              className="w-full h-48 object-cover rounded mb-3"
            />
          )}
          <div>
            <div className="font-semibold text-sm">{pl.name}</div>
            <div className="text-xs mt-2">{pl.tracks?.length ?? 0} tracks</div>
          </div>
        </div>
      ))}
    </div>
  )
}
