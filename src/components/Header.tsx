import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet'
import {
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenu
} from '@/components/ui/navigation-menu'

const VITE_SPOTIFY_CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID
const VITE_SPOTIFY_REDIRECT_URI = process.env.VITE_SPOTIFY_REDIRECT_URI
const VITE_SPOTIFY_AUTH_ENDPOINT = process.env.VITE_SPOTIFY_AUTH_ENDPOINT
const VITE_SPOTIFY_RESPONSE_TYPE = process.env.VITE_SPOTIFY_RESPONSE_TYPE

const Header = (): JSX.Element => {
  const [token, setToken] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    let spotifyToken: string | null =
      window.localStorage.getItem('spotifyToken')

    if (!spotifyToken && hash) {
      spotifyToken =
        hash
          .substring(1)
          .split('&')
          .find((el) => el.startsWith('access_token'))
          ?.split('=')[1] ?? null

      window.location.hash = ''
      window.localStorage.setItem('spotifyToken', spotifyToken ?? '')
    }

    setToken(spotifyToken ?? '')
  }, [])

  const logout = (): void => {
    setToken('')
    window.localStorage.removeItem('spotifyToken')
  }

  const lgLinkClasses =
    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'

  return (
    <div className='container mx-auto px-4 md:px-6 lg:px-8'>
      <header className='flex h-20 w-full shrink-0 items-center px-4 md:px-6'>
        <Sheet>
          <SheetTrigger asChild>
            <Button className='lg:hidden' size='icon' variant='outline'>
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left'>
            <a href='#'>
              <span className='sr-only'>ShadCN</span>
            </a>
            <div className='grid gap-2 py-6'>
              <a
                className='flex w-full items-center py-2 text-lg font-semibold'
                href='#'>
                Search Artists
              </a>
              <a
                className='flex w-full items-center py-2 text-lg font-semibold'
                href='#'>
                Playlists
              </a>
              <a
                className='flex w-full items-center py-2 text-lg font-semibold'
                href='#'>
                Genres
              </a>
              <a
                className='flex w-full items-center py-2 text-lg font-semibold'
                href='#'>
                User
              </a>
              <a
                className='flex w-full items-center py-2 text-lg font-semibold'
                href='#'>
                Duplicates
              </a>
            </div>
          </SheetContent>
        </Sheet>
        <a className='mr-6 hidden lg:flex' href='#'>
          <span className='sr-only'>ShadCN</span>
        </a>
        <NavigationMenu className='hidden lg:flex'>
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <a className={lgLinkClasses} href='#'>
                Search Artists
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <a className={lgLinkClasses} href='#'>
                Playlists
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <a className={lgLinkClasses} href='#'>
                Genres
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <a className={lgLinkClasses} href='#'>
                User
              </a>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <a className={lgLinkClasses} href='#'>
                Duplicates
              </a>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='ml-auto flex gap-2'>
          {!token ? (
            <Button asChild>
              <a
                href={`${VITE_SPOTIFY_AUTH_ENDPOINT}?client_id=${VITE_SPOTIFY_CLIENT_ID}&redirect_uri=${VITE_SPOTIFY_REDIRECT_URI}&response_type=${VITE_SPOTIFY_RESPONSE_TYPE}`}>
                Authenticate
              </a>
            </Button>
          ) : (
            <Button className={lgLinkClasses} onClick={logout}>
              Logout
            </Button>
          )}

          {/* <Button variant='outline'>Sign in</Button>
          <Button>Sign Up</Button> */}
        </div>
      </header>
    </div>
  )
}

export default Header