function normalizeImage(image) {
  if (!image) return null
  return {
    url: image.url,
    width: image.width ?? null,
    height: image.height ?? null,
  }
}

function normalizeArtist(artist) {
  if (!artist) return null
  return {
    id: artist.id,
    name: artist.name,
  }
}

function normalizeAlbum(album) {
  if (!album) return null
  return {
    id: album.id,
    name: album.name,
    images: Array.isArray(album.images) ? album.images.map(normalizeImage).filter(Boolean) : [],
  }
}

function normalizeTrack(track) {
  if (!track) return null
  return {
    id: track.id,
    name: track.name,
    duration_ms: track.duration_ms,
    explicit: track.explicit ?? false,
    artists: Array.isArray(track.artists) ? track.artists.map(normalizeArtist).filter(Boolean) : [],
    album: normalizeAlbum(track.album),
    uri: track.uri,
  }
}

function normalizePlaylist(details, tracksItems) {
  return {
    id: details.id,
    name: details.name,
    description: details.description ?? null,
    images: Array.isArray(details.images) ? details.images.map(normalizeImage).filter(Boolean) : [],
    owner: details.owner ? { display_name: details.owner.display_name ?? '' } : null,
    tracks: Array.isArray(tracksItems)
      ? tracksItems.map((item) => normalizeTrack(item.track)).filter(Boolean)
      : [],
  }
}

module.exports = {
  normalizePlaylist,
}
