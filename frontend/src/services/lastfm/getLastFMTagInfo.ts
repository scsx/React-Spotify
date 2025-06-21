import axios from 'axios'

export async function getLastFMTagInfo(tagName: string) {
  try {
    const response = await axios.get(`/api/lastfm/tag.getinfo`, {
      params: {
        tag: tagName,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching Last.FM tag info for '${tagName}' via proxy:`, error)
    if (axios.isAxiosError(error) && error.response) {
      return {
        error:
          error.response.data.error ||
          `Failed to load tag info for '${tagName}' from Last.FM proxy.`,
      }
    }
    return { error: 'An unexpected error occurred.' }
  }
}
