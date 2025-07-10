import React from 'react'

import { TErrorDisplay } from '@/types/General'
import { MdErrorOutline } from 'react-icons/md'

import Text from '@/components/Text'

const ErrorDisplay: React.FC<TErrorDisplay> = ({ title = 'Error', message, details }) => {
  return (
    <div className="flex md:w-1/2 p-8 border rounded-lg mt-16">
      <div className="w-[70px] text-5xl text-left">
        <MdErrorOutline />
      </div>
      <div>
        <Text variant="h3" as="h3" className="mb-8">
          {title}
        </Text>
        <pre className="mb-8 text-foreground text-wrap text-red-400">{message}</pre>
        {details && <Text variant="paragraph">{details}</Text>}
      </div>
    </div>
  )
}

export default ErrorDisplay
