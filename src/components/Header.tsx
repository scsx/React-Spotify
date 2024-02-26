import { Button } from '@/components/ui/button'
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet'
import {
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenu
} from '@/components/ui/navigation-menu'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import HeaderNav from './HeaderNav'
import HeaderNavMobile from './HeaderNavMobile'
import Switch from './Switch'
import { useToken } from '@/contexts/TokenContext'

const Header = (): JSX.Element => {
  const token = useToken()

  const lgLinkClasses =
    'basenav__link group h-8 inline-flex w-max items-center justify-center rounded-md bg-transparent px-4 py-1 text-sm font-medium transition-colors hover:bg-primary hover:text-white focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-primary dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'

  return (
    <div className='fixed z-50 w-full mx-auto px-4 md:px-6 lg:px-8 bg-black/10 dark:bg-black/15 backdrop-blur border-b border-white border-opacity-20 dark:border-gray-700'>
      <header className='flex h-20 container shrink-0 items-center'>
        <Sheet>
          <SheetTrigger asChild>
            <Button className='lg:hidden' size='icon' variant='outline'>
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left'>
            <div className='grid gap-2 py-6'>
              {token?.isValid ? (
                <HeaderNavMobile />
              ) : (
                <Alert className='mt-8'>
                  <AlertTitle>Authorization needed!</AlertTitle>
                  <AlertDescription>Click the green button "Authenticate".</AlertDescription>
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
            {token?.isValid && <HeaderNav classes={lgLinkClasses} />}
          </NavigationMenuList>
        </NavigationMenu>
        <div className='ml-auto flex items-center gap-2'>
          <Switch text='Dark mode' classes='flex mr-4' />

          {!token?.isValid ? (
            <Button asChild>
              <a className='text-white' href={token?.authLink}>
                Authenticate
              </a>
            </Button>
          ) : (
            <a className={lgLinkClasses} onClick={token?.logout} href={''}>
              Logout
            </a>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header
