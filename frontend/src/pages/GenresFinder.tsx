import { useParams } from 'react-router-dom'

import { IoArrowBack } from 'react-icons/io5'

import GenresFinderLayout from '@/components/Genres/GenresFinderLayout/GenresFinderLayout'
import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

const GenresFinder = (): JSX.Element => {
  const { genresNames } = useParams()

  return (
    <div className="container flex flex-col flex-1 justify-center">
      <div className="flex mb-16">
        <div className="grow">
          <Text variant="h1">Genres Finder</Text>
          <Text variant="h2">{genresNames}</Text>
        </div>
        <Hyperlink
          className="flex items-center gap-x-2 h-[25px] text-sm bg-gray-200 text-black dark:bg-gray-800 dark:text-white py-1 px-3 rounded-[6px] hover:no-underline hover:bg-gray-300 dark:hover:bg-gray-700"
          href="/genres"
        >
          <IoArrowBack />All Genres
        </Hyperlink>
      </div>

      <GenresFinderLayout genresNames={genresNames ?? ''} />
    </div>
  )
}

export default GenresFinder
