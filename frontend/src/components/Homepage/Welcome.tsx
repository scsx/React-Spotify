import { MdArrowOutward } from 'react-icons/md'

import { Button } from '@/components/ui/button'

import { useAuth } from '@/contexts/AuthContext'

const Welcome = (): JSX.Element => {
  const { isLoggedIn, authLink, checkAuthStatus } = useAuth()

  const handleLogin = () => {
    const popup = window.open(
      authLink,
      'spotifyAuthPopup',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    )

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup)
        checkAuthStatus()
      }
    }, 500) // Verifica a cada 500ms
  }

  return (
    <div className="w-full md:w-2/3">
      <div className="block">
        <h1 className="inline-block text-6xl lg:text-9xl bg-gradient-to-l from-primary to-black dark:to-white text-transparent bg-clip-text">
          Welcome.
        </h1>
      </div>
      <hr />

      <p className="text-2xl pt-4 shadow-[0_-13px_14px_-10px_rgba(0,0,0,0.11)]">
        {isLoggedIn ? (
          'You can now:'
        ) : (
          <Button className="text-2xl text-white" onClick={handleLogin}>
            Authenticate
          </Button>
        )}
      </p>
      <ul className="mt-4 -ml-2">
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Search artists and genres
        </li>
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Find more artists by genre
        </li>
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Find duplicates on playlists
        </li>
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Check your user info
        </li>
      </ul>

      <p className="mt-8">TODO: {isLoggedIn ? 'logged in' : 'not'}</p>
    </div>
  )
}

export default Welcome
