import GenresPageLayout from '@/components/Genres/GenresPageLayout/GenresPageLayout'
import Text from '@/components/shared/Text'

const GenresPage = (): JSX.Element => {
  return (
    <div className="container">
      <Text variant="h1">Genres</Text>
      <GenresPageLayout />
    </div>
  )
}

export default GenresPage
