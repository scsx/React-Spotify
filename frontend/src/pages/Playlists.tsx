import { useToken } from '../contexts/TokenContext'
import LoadingSpinner from '@/components/LoadingSpinner'


const Playlists = (): JSX.Element => {
  const token = useToken()

  return (
    <div className='container flex flex-col flex-1 justify-center'>
      <h1>Playlists</h1>
      <LoadingSpinner />
      {token?.isValid}
    </div>
  )
}

export default Playlists
