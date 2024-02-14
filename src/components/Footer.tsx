const Footer = (): JSX.Element => {
  return (
    <footer className='text-gray-600 py-4'>
      <div className='container mx-auto'>
        <p>
          By{' '}
          <a
            href='https://soucasaux.com'
            target='_blank'
            className='hover:text-primary'>
            SCSX
          </a>
          . Repo:{' '}
          <a
            href='https://github.com/scsx/React-Spotify'
            target='_blank'
            className='hover:text-primary'>
            React-Spotify
          </a>.
        </p>
      </div>
    </footer>
  )
}

export default Footer
