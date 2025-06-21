import SearchArtists from '@/components/Search/SearchArtists'
import Welcome from '@/components/Homepage/Welcome'

import { useToken } from '../contexts/TokenContext'

const HomepageSearchArtists = (): JSX.Element => {
  const token = useToken()
  const isAuthorized = token?.isValid

  return (
    <div className="home container flex flex-col flex-1 justify-center">
      {isAuthorized ? <SearchArtists /> : <Welcome />}
    </div>
  )
}

export default HomepageSearchArtists
