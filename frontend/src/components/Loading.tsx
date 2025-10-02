import React from 'react'

import { RiLoader4Line } from 'react-icons/ri'

import Text from '@/components/Text'

interface LoadingProps {
  message?: string
  type?: 'spinner' | 'skeleton'
  gridSize?: '2x2' | '3x3' | '4x4'
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  type = 'spinner',
  gridSize = '3x3',
}) => {
  // TODO: remove 1x1
  const getGridDimensions = (size: string) => {
    switch (size) {
      case '2x2':
        return { cols: 2, rows: 2 }
      case '3x3':
        return { cols: 3, rows: 3 }
      case '4x4':
        return { cols: 4, rows: 4 }
      default:
        return { cols: 3, rows: 3 }
    }
  }

  const { cols, rows } = getGridDimensions(gridSize)
  const totalItems = cols * rows

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {type === 'spinner' ? (
        <div className="relative flex flex-col items-center justify-center w-32 h-32">
          <RiLoader4Line className="text-6xl animate-spin text-green-500 opacity-70" />
          <Text variant="h3" as="h3" className="mt-4">
            {message}
          </Text>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-4 w-full max-w-5xl`}>
          {Array.from({ length: totalItems }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 w-full flex items-center space-x-4"
            >
              <div className="w-32 h-32 bg-gray-700 rounded-md animate-pulse"></div>
              <div>
                <div className="h-6 w-48 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Loading
