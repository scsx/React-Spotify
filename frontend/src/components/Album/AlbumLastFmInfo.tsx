import React, { useEffect, useState } from 'react'

import { TLastFmAlbumGetInfoResponse } from '@/types/LastFmAlbum'
import { FaLastfm } from 'react-icons/fa'

import ErrorDisplay from '@/components/ErrorDisplay'
import Hyperlink from '@/components/Hyperlink'
import Loading from '@/components/Loading'
import Text from '@/components/Text'

import { getLastFMAlbumInfo } from '@/services/lastfm/getLastFMAlbumInfo'

import { formatNumberWithSeparators } from '@/lib/format-number-with-separators'

interface AlbumLastFmInfoProps {
  artistName: string
  albumName: string
}

const AlbumLastFmInfo: React.FC<AlbumLastFmInfoProps> = ({ artistName, albumName }) => {
  const [lastFmData, setLastFmData] = useState<TLastFmAlbumGetInfoResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLastFmData = async () => {
      if (!artistName || !albumName) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await getLastFMAlbumInfo(artistName, albumName)
        console.log(result)

        if ('error' in result) {
          setError(result.message)
          setLastFmData(null)
        } else {
          setLastFmData(result)
        }
      } catch (err) {
        setError('Ocorreu um erro ao comunicar com o servidor.')
        setLastFmData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLastFmData()
  }, [artistName, albumName])

  const albumContent = lastFmData?.album?.wiki?.content
  const albumSummary = lastFmData?.album?.wiki?.summary
  const finalDescription =
    albumContent ||
    (albumSummary ? albumSummary.replace(/<a.*?>Read more<\/a>\s*?$/, '').trim() : null)

  const tagsData = lastFmData?.album?.tags
  const tagArray = Array.isArray(tagsData?.tag) ? tagsData.tag : []

  const listeners = lastFmData?.album.listeners
  const playcount = lastFmData?.album.playcount

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorDisplay message={error} />
  }

  return (
    <div className="mt-12">
      <Text variant="h4" className="flex items-center mb-4">
        <span className="grow">Last FM</span>
        <Hyperlink href={lastFmData?.album.url} external>
          <FaLastfm className="text-red-500 text-2xl mr-2 hover:text-gray-500" />
        </Hyperlink>
      </Text>
      {lastFmData && (
        <>
          <Text dangerouslySetInnerHTML={{ __html: finalDescription || '' }} className="mb-4" />

          {(listeners || playcount) && (
            <ul className="list-disc pl-5">
              {listeners && (
                <li>
                  <Text className="mb-2">{formatNumberWithSeparators(listeners)} listeners</Text>
                </li>
              )}
              {playcount && (
                <li>
                  <Text className="mb-6">{formatNumberWithSeparators(playcount)} plays</Text>
                </li>
              )}
            </ul>
          )}

          {tagArray.length > 0 && (
            <>
              <Text variant="h5" className="mb-4">
                Genres & Tags
              </Text>
              <div className="flex flex-wrap gap-2">
                {tagArray.map((tag) => (
                  <Hyperlink
                    key={tag.name}
                    href={tag.url}
                    className="rounded-full font-normal bg-secondary py-1 px-4 text-sm text-gray-700 dark:text-white no-underline hover:no-underline hover:text-white dark:hover:text-white hover:bg-red-500"
                    external
                  >
                    {tag.name.replace(/\+/g, ' ')}
                  </Hyperlink>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default AlbumLastFmInfo
