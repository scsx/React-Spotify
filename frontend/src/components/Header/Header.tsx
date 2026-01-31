import { Link } from 'react-router-dom'

import { RxHamburgerMenu } from 'react-icons/rx'

import UserLoggedIn from '@/components/Header/UserLoggedIn'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { useAuth } from '@/contexts/AuthContext'

import Switch from '../shared/Switch'
import HeaderNav from './HeaderNav'
import HeaderNavMobile from './HeaderNavMobile'

const Header = (): JSX.Element => {
  const { isLoggedIn, logout, user } = useAuth()

  return (
    <div className="fixed z-50 w-full mx-auto bg-black/10 dark:bg-black/15 backdrop-blur border-b border-white/20 dark:border-black/20">
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
                Spotify<span className="text-primary text-2xl">+</span>
              </Link>
            </NavigationMenuItem>
            {isLoggedIn && <HeaderNav />}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-2">
          <Switch text="Dark mode" classes="flex mr-4" />

          {isLoggedIn && <UserLoggedIn user={user} logout={logout} />}
        </div>
      </header>
    </div>
  )
}

export default Header
