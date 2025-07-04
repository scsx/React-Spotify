import Hyperlink from '@/components/Hyperlink'

import Player from './Player'

const Footer = (): JSX.Element => {
  return (
    <footer className="fixed z-50 w-full bottom-0 text-gray-600 py-4 backdrop-blur border-t border-gray-300 dark:border-gray-700">
      <div className="flex container mx-auto items-center">
        <div className="flex-1">
          <Player />
        </div>
        <p>
          By{' '}
          <Hyperlink href="https://soucasaux.com" variant="title" external>
            SCSX
          </Hyperlink>
          .{' '}
          <Hyperlink href="/dev-notes" variant="title">
            Dev notes.{' '}
          </Hyperlink>
          <Hyperlink href="https://github.com/scsx/React-Spotify" external variant="title">
            Repo
          </Hyperlink>
          .
        </p>
      </div>
    </footer>
  )
}

export default Footer
