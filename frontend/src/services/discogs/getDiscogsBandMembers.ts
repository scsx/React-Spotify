import { TDiscogsBandMembersError, TDiscogsBandMembersResponse } from '@/types/Discogs'
import axios from 'axios'

export async function getDiscogsBandMembers(
  artistName: string
): Promise<TDiscogsBandMembersResponse | TDiscogsBandMembersError> {
  try {
    const response = await axios.get<TDiscogsBandMembersResponse>(`/api/discogs/artist/members`, {
      params: {
        artistName,
      },
    })
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      if (typeof error.response.data === 'object' && 'error' in error.response.data) {
        console.error(
          'Error fetching Discogs band members (API Error Response):',
          error.response.data.error
        )
        return error.response.data as TDiscogsBandMembersError
      }
      console.error(
        'Error fetching Discogs band members (HTTP Error Response):',
        error.response.status,
        error.response.data
      )
      return {
        error: `API Error: ${error.response.status}`,
        details: error.response.data.error || 'Unknown error',
      }
    }

    console.error(
      'Error fetching Discogs band members via proxy (Network/Unknown Error):',
      error instanceof Error ? error.message : String(error)
    )
    return { error: 'Failed to load band members from Discogs.' }
  }
}
