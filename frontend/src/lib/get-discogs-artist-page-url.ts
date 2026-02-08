export function getDiscogsArtistPageUrl(resourceUrl: string): string {
  const match = resourceUrl.match(/\/artists\/(\d+)/)
  if (match && match[1]) {
    return `https://www.discogs.com/artist/${match[1]}`
  }
  return resourceUrl
}
