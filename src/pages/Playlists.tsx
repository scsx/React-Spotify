import { useToken } from '../contexts/TokenContext'


const Playlists = (): JSX.Element => {
  const token = useToken()

  return (
    <div className='container flex flex-col flex-1 justify-center'>
      <h1>Playlists</h1>
      {token?.isValid}
    </div>
  )
}

export default Playlists
