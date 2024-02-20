import { NavLink } from 'react-router-dom'

const HeaderNavMobile = (): JSX.Element => {
  const smLinkClasses = 'flex w-full items-center py-2 text-lg font-semibold'

  return (
    <>
      <NavLink to='/' end className={smLinkClasses}>
        Artists
      </NavLink>
      <NavLink to='/playlists' className={smLinkClasses}>
        Playlists
      </NavLink>
      <NavLink to='/genres' className={smLinkClasses}>
        Genres
      </NavLink>
      <a
        className='flex w-full items-center py-2 text-lg font-semibold'
        href='#'>
        User
      </a>
      <NavLink to='/user' className={smLinkClasses}>
        User
      </NavLink>
    </>
  )
}

export default HeaderNavMobile
