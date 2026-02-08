import React from 'react'

import { FaGoogle, FaLastfm, FaSpotify } from 'react-icons/fa'
import { GiCompactDisc } from 'react-icons/gi'
import { TbBraces } from 'react-icons/tb'
import { twMerge } from 'tailwind-merge'

type TIconBrandType = 'spotify' | 'discogs' | 'lastfm' | 'genius' | 'google'

type TIconBrandProps = {
  type: TIconBrandType
  className?: string
}

const IconBrand = ({ type, className = '' }: TIconBrandProps): React.ReactNode => {
  const defaultColors: Record<TIconBrandType, string> = {
    spotify: 'text-muted-foreground',
    discogs: 'text-orange-discogs',
    lastfm: 'text-red-600',
    genius: 'text-yellow-genius',
    google: 'text-gray-600',
  }

  const mergedClassName = twMerge(defaultColors[type], className)

  const iconMap: Record<TIconBrandType, React.ReactNode> = {
    spotify: <FaSpotify className={mergedClassName} />,
    discogs: <GiCompactDisc className={mergedClassName} />,
    lastfm: <FaLastfm className={mergedClassName} />,
    genius: <TbBraces className={mergedClassName} />,
    google: <FaGoogle className={mergedClassName} />,
  }

  return iconMap[type] || null
}

export default IconBrand
