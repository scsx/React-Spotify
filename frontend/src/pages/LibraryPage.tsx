import { BsDatabaseDown } from 'react-icons/bs'

import LibraryLayout from '@/components/Library/LibraryLayout'
import Text from '@/components/shared/Text'

const LibraryPage = () => {
  return (
    <div className="relative container">
      <Text variant="h1" className="flex items-center mb-8 gap-4">
        <small>
          <BsDatabaseDown />
        </small>{' '}
        Library
      </Text>
      <LibraryLayout />
    </div>
  )
}

export default LibraryPage
