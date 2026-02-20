import type { TSkileyLikedSong } from '@/types/SkileyTrack'

export async function getTopGenres(
  songs: TSkileyLikedSong[] | null | undefined,
  limit: number = 10
): Promise<{ genre: string; count: number }[]> {
  if (!songs || songs.length === 0) {
    return []
  }

  const genreCount = new Map<string, number>()

  songs.forEach((song) => {
    if (!song.artistGenres) return

    // Split genres by comma and trim whitespace
    const genres = song.artistGenres
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)

    genres.forEach((genre) => {
      genreCount.set(genre, (genreCount.get(genre) || 0) + 1)
    })
  })

  // Sort by count descending and return top N
  return Array.from(genreCount.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
