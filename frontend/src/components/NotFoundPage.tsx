import React from 'react'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

const NotFoundPage: React.FC = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[50%] text-center">
      <Text as="h1" className='text-[100px] font-semibold tracking-wide'>
        404
      </Text>
      <Text variant="h2" as="h2">
        Page not found!
      </Text>
      <Text className='mt-12'>
        <Hyperlink href="/">Go back to homepage</Hyperlink>
      </Text>
    </div>
  )
}

export default NotFoundPage
