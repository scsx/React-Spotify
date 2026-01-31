import { MdArrowOutward } from 'react-icons/md'

import Hyperlink from '@/components/shared/Hyperlink'

import { useAuth } from '@/contexts/AuthContext'

import { SPOTIFY_AUTH_LOGIN_PATH } from '@/lib/constants'

const Welcome = (): JSX.Element => {
  const { isLoggedIn } = useAuth()

  const ActionItem = ({ label, href }: { label: string; href: string }) => (
    <>
      <MdArrowOutward className="inline text-2xl animate-pulse" />{' '}
      {isLoggedIn ? (
        <Hyperlink href={href} variant="title">
          {label}
        </Hyperlink>
      ) : (
        label
      )}
    </>
  )

  return (
    <div className="w-full md:w-2/3">
      <div className="block">
        <h1 className="inline-block text-6xl lg:text-9xl bg-gradient-to-l from-primary to-black dark:to-white text-transparent bg-clip-text">
          All done.
        </h1>
      </div>
      <hr />

      <p className="text-2xl pt-4 shadow-[0_-13px_14px_-10px_rgba(0,0,0,0.11)]">
        {isLoggedIn ? (
          'You can now:'
        ) : (
          <Hyperlink href={SPOTIFY_AUTH_LOGIN_PATH}>Authenticate</Hyperlink>
        )}
      </p>
      <ul className="mt-4 -ml-2">
        <li className="text-xl mb-2">
          <ActionItem label="Search artists" href="/artists" />
        </li>
        <li className="text-xl mb-2">
          <ActionItem label="Explore genres" href="/genres" />
        </li>
        <li className="text-xl mb-2">
          <ActionItem label="Find duplicates on playlists" href="/duplicates" />
        </li>
        <li className="text-xl mb-2">
          <ActionItem label="Check your user info" href="/user" />
        </li>
      </ul>

      <p className="mt-8">TODO: {isLoggedIn ? 'logged in' : 'not'}</p>
    </div>
  )
}

export default Welcome
