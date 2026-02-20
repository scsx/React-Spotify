import { useCallback, useMemo } from 'react'

import { useTopGenres } from '@/hooks/useTopGenres'
import { scaleLog } from '@visx/scale'
import { Text as VisxText } from '@visx/text'
import { Wordcloud } from '@visx/wordcloud'

import Loading from '@/components/shared/Loading'
import Text from '@/components/shared/Text'

type WordData = {
  text: string
  value: number
}

const GenresPageLayout = () => {
  const { topGenres, isLoading } = useTopGenres()

  const WIDTH = 1000
  const HEIGHT = 600

  // Convert to wordcloud format
  const words: WordData[] = useMemo(
    () => topGenres.map((g) => ({ text: g.genre, value: g.count })),
    [topGenres]
  )

  // Font scale
  const fontScale = useMemo(() => {
    const values = words.map((w) => w.value)
    return scaleLog({
      domain: [Math.min(...values), Math.max(...values)],
      range: [16, 48],
    })
  }, [words])

  const fontSizeSetter = useCallback((word: WordData) => fontScale(word.value), [fontScale])

  // Map to get count for each genre
  const wordCountMap = useMemo(() => {
    return new Map(topGenres.map((g) => [g.genre, g.count]))
  }, [topGenres])

  if (isLoading) return <Loading />

  if (topGenres.length === 0) return <Text>No genres found</Text>

  return (
    <div className="pt-16">
      <Text variant="h2" className="mb-8">
        Top Genres
      </Text>

      <div className="w-full flex justify-center">
        <Wordcloud
          words={words}
          width={WIDTH}
          height={HEIGHT}
          fontSize={fontSizeSetter}
          font="system-ui, -apple-system, sans-serif"
          padding={12}
          random={() => 0.5}
        >
          {(cloudWords) =>
            cloudWords
              .filter((w): w is typeof w & { text: string } => w.text != null)
              .map((w) => (
                <VisxText
                  key={w.text}
                  fill="currentColor"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontSize: `${w.size}px`,
                    fontFamily: w.font,
                    fontWeight: 500,
                    opacity: 0.8,
                  }}
                  transform={`translate(${w.x}, ${w.y})`}
                >
                  {`${w.text} (${(wordCountMap.get(w.text) ?? 0).toString()})`}
                </VisxText>
              ))
          }
        </Wordcloud>
      </div>

      <Text variant="paragraph" color="muted" className="mt-4 text-sm">
        {words.length} géneros
      </Text>
    </div>
  )
}

export default GenresPageLayout
