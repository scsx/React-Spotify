type TPlaylist = {
  id: string
  name: string
  description?: string | null
  images?: { url: string }[]
  owner?: { display_name?: string }
  tracks?: Array<{
    id: string
    name: string
    uri?: string
    duration_ms?: number
    artists?: { id: string; name: string }[]
    album?: { id: string; name?: string; images?: { url: string }[] }
  }>
}

type Props = {
  playlists: TPlaylist[] | null | undefined
}

export default function TemporaryPLViewer({ playlists }: Props) {
  if (!playlists || playlists.length === 0) {
    return <div>Nenhuma playlist disponível.</div>
  }

  return (
    <div className="space-y-4 bg-gray-900">
      {playlists.map((pl) => (
        <div key={pl.id} className="p-3">
          <div className="flex items-center gap-3">
            {pl.images && pl.images[0] && (
              <img
                src={pl.images[0].url}
                alt={pl.name}
                className="w-14 h-14 object-cover rounded"
              />
            )}
            <div>
              <div className="font-semibold">{pl.name}</div>
              <div className="text-sm">{pl.owner?.display_name || ''}</div>
              <div className="text-xs mt-1">{pl.tracks?.length ?? 0} tracks</div>
            </div>
          </div>

          {/* {pl.tracks && pl.tracks.length > 0 && (
            <div className="mt-3 space-y-2 ml-4">
              {pl.tracks.map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm">
                      {t.artists?.map((a) => a.name).join(', ')} — {t.album?.name}
                    </div>
                  </div>
                  <div className="text-xs">{Math.round((t.duration_ms ?? 0) / 1000)}s</div>
                </div>
              ))}
            </div>
          )} */}
        </div>
      ))}
    </div>
  )
}
