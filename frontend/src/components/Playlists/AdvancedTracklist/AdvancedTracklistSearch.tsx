import React from 'react'

import Text from '@/components/Text'

interface AdvancedTracklistSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  totalItems?: number
}

const AdvancedTracklistSearch: React.FC<AdvancedTracklistSearchProps> = ({
  searchTerm,
  onSearchChange,
  totalItems = 0,
}) => {
  const isClearVisible = searchTerm.length > 0

  const handleClearSearch = () => {
    onSearchChange('')
  }

  return (
    <div className="flex items-center w-full relative gap-x-8">
      <input
        className="px-3 py-2 text-sm w-1/3 bg-white dark:bg-transparent font-normal text-black dark:text-white border focus:outline-none dark:focus:dark:bg-slate-900"
        type="text"
        placeholder={`Search by title, artist or album`}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Text>{totalItems} results</Text>

      {isClearVisible && (
        <Text onClick={handleClearSearch} className="cursor-pointer">
          Clear
        </Text>
      )}
    </div>
  )
}

export default AdvancedTracklistSearch
