import { useParams } from 'react-router-dom'

import GenresFinderLayout from '@/components/Genres/GenresFinderLayout/GenresFinderLayout'
import Text from '@/components/shared/Text'

const GenresFinder = (): JSX.Element => {
  const { genresNames } = useParams()

  return (
    <div className="container flex flex-col flex-1 justify-center">
      <Text variant="h1">Genres Finder</Text>
      <Text variant="h2">{genresNames}</Text>

      <GenresFinderLayout genresNames={genresNames ?? ''} />
    </div>
  )
}

export default GenresFinder
