import Text from '@/components/shared/Text'
import LibraryLayout from '@/components/Library/LibraryLayout'

const LibraryPage = () => {
  return (
    <div className="relative container">
      <Text variant="h1" className="mb-8">
        Library
      </Text>
      <LibraryLayout />
    </div>
  )
}

export default LibraryPage
