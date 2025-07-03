import { Link } from 'react-router-dom'

import { RxHamburgerMenu } from 'react-icons/rx'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { useAuth } from '@/contexts/AuthContext'

import Switch from '../Switch'
import HeaderNav from './HeaderNav'
import HeaderNavMobile from './HeaderNavMobile'

const Header = (): JSX.Element => {
  const { isLoggedIn, authLink, logout, user } = useAuth()

  // TODO: clean up legacy classes.
  const lgLinkClasses =
    'basenav__link group h-8 inline-flex w-max items-center justify-center rounded-md bg-transparent px-4 py-1 text-sm font-medium transition-colors hover:bg-primary hover:text-white focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-primary dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'

  return (
    <div className="fixed z-50 w-full mx-auto px-4 md:px-6 lg:px-8 bg-black/10 dark:bg-black/15 backdrop-blur border-b border-white/20 dark:border-black/20">
      <header className="flex h-20 container shrink-0 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden" size="icon" variant="outline">
              <RxHamburgerMenu />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-2 py-6">
              {isLoggedIn ? (
                <HeaderNavMobile />
              ) : (
                <Alert className="mt-8">
                  <AlertTitle>Authorization needed!</AlertTitle>
                  <AlertDescription>Click the green button "Authenticate".</AlertDescription>
                </Alert>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem className="text-xl mr-5">
              <Link to="/" className="block -mt-1">
                Spotify<span className="text-primary">+</span>
              </Link>
            </NavigationMenuItem>
            {isLoggedIn && <HeaderNav classes={lgLinkClasses} />}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-2">
          <Switch text="Dark mode" classes="flex mr-4" />

          {!isLoggedIn ? (
            <Button asChild>
              {/* USAR authLink DIRETAMENTE */}
              <a className="text-white" href={authLink}>
                Authenticate
              </a>
            </Button>
          ) : (
            <>
              {/* EXIBIR NOME DO USUÁRIO SE DISPONÍVEL */}
              {user && <span className="text-white mr-2">Olá, {user.display_name}!</span>}
              {/* USAR logout DIRETAMENTE */}
              <Button className={lgLinkClasses} onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header
