import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet'
import {
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenu
} from '@/components/ui/navigation-menu'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import HeaderNav from './HeaderNav'
import Switch from './Switch'

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
    <div className='fixed z-50 container mx-auto px-4 md:px-6 lg:px-8 bg-black/15 backdrop-blur border-b border-grey-900'>
      <header className='flex h-20 w-full shrink-0 items-center px-4 md:px-6'>
        <Sheet>
          <SheetTrigger asChild>
            <Button className='lg:hidden' size='icon' variant='outline'>
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left'>
            <div className='grid gap-2 py-6'>
              {token ? (
                <>
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
                </>
              ) : (
                <Alert className='mt-8'>
                  <AlertTitle>Authorization needed!</AlertTitle>
                  <AlertDescription>
                    Click the green button "Authenticate".
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <NavigationMenu className='hidden lg:flex'>
          <NavigationMenuList>
            <NavigationMenuItem className='text-lg mr-5'>
              <span className='block -mt-1'>SCSX React Spotify</span>
            </NavigationMenuItem>
            {token && <HeaderNav classes={lgLinkClasses} />}
          </NavigationMenuList>
        </NavigationMenu>
        <div className='ml-auto flex items-center gap-2'>
          <Switch text='Dark mode' classes='flex mr-4' />

          {!token ? (
            <Button asChild>
              <a
                href={`${VITE_SPOTIFY_AUTH_ENDPOINT}?client_id=${VITE_SPOTIFY_CLIENT_ID}&redirect_uri=${VITE_SPOTIFY_REDIRECT_URI}&response_type=${VITE_SPOTIFY_RESPONSE_TYPE}`}>
                Authenticate
              </a>
            </Button>
          ) : (
            <a className={lgLinkClasses} onClick={logout} href={''}>
              Logout
            </a>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header
