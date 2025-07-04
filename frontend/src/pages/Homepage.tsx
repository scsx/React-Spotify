import Welcome from '@/components/Homepage/Welcome'
import SearchArtists from '@/components/Search/SearchArtists'

import { useAuth } from '../contexts/AuthContext'

const HomepageSearchArtists = (): JSX.Element => {
  const { isLoggedIn } = useAuth()

  return (
    <div className="home container flex flex-col flex-1 justify-center">
      {isLoggedIn ? <SearchArtists /> : <Welcome />}
    </div>
  )
}

export default HomepageSearchArtists
