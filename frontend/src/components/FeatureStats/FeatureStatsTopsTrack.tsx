import { TSkileyLikedSong } from '@/types/SkileyTrack'
import { twMerge } from 'tailwind-merge'

import Text from '@/components/Text'
import { Progress } from '@/components/ui/progress'

type Props = {
  track: TSkileyLikedSong
  value?: number
  unit?: string
  isPercentage?: boolean
  alignRight?: boolean
}

const FeatureStatsTopsTrack = ({ track, value, unit, alignRight }: Props) => {
  const formatValue = () => {
    if (value === undefined) return ''
    if (unit === '%') return `${Math.round(value * 100)}%`
    if (unit) return `${value} ${unit}`
    return value
  }

  return (
    <div className="mb-4">
      <Text className={twMerge('leading-none mb-1 flex items-center', alignRight && 'justify-end')}>
        <span
          className={twMerge(
            'font-mono text-primary text-xs whitespace-nowrap',
            alignRight ? 'order-first mr-3' : 'order-last ml-3'
          )}
        >
          {formatValue()}
        </span>
        {track.trackName}
      </Text>
      <Text color="muted" className="leading-none">
        {track.artistName}
      </Text>
      {typeof value === 'number' && <Progress value={value * 100} className="h-0.5 mt-1" />}
    </div>
  )
}

export default FeatureStatsTopsTrack
