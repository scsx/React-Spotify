import Player from './Player'

const Footer = (): JSX.Element => {
  return (
    <footer className='fixed z-50 w-full bottom-0 text-gray-600 py-4 backdrop-blur border-t border-gray-300 dark:border-gray-700'>
      <div className='flex container mx-auto'>
        <div className='flex-1'>
          <Player />
        </div>
        <p>
          By{' '}
          <a href='https://soucasaux.com' target='_blank' className='hover:text-primary'>
            SCSX
          </a>
          .{' '}
          <a
            href='https://github.com/scsx/React-Spotify'
            target='_blank'
            className='hover:text-primary'>
            Repo
          </a>
          .
        </p>
      </div>
    </footer>
  )
}

export default Footer
