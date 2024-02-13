import {
  NavigationMenuLink,
  NavigationMenuItem
} from '@/components/ui/navigation-menu'

interface HeaderNavProps {
  classes?: string
}

const HeaderNav: React.FC<HeaderNavProps> = ({ classes = '' }): JSX.Element => {
  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <a className={classes} href='#'>
            Search Artists
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <a className={classes} href='#'>
            Playlists
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <a className={classes} href='#'>
            Genres
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <a className={classes} href='#'>
            User
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <a className={classes} href='#'>
            Duplicates
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  )
}

export default HeaderNav
