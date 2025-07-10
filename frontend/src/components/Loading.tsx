import React from 'react'

import { RiLoader4Line } from 'react-icons/ri'

import Text from '@/components/Text'

interface LoadingProps {
  message?: string
  type?: 'spinner' | 'skeleton'
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', type = 'spinner' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {type === 'spinner' ? (
        <div className="relative flex items-center justify-center w-32 h-32">
          <RiLoader4Line className="text-6xl animate-spin text-green-500 opacity-70" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 mt-4 w-full max-w-lg flex items-center space-x-4">
          <div className="w-32 h-32 bg-gray-700 rounded-md animate-pulse"></div>
          <div>
            <div className="h-6 w-48 bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      )}

      <Text variant="h3" as="h3" className="mt-4">
        {message}
      </Text>
    </div>
  )
}

export default Loading
