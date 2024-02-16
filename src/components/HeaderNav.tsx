import { NavLink } from 'react-router-dom'
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
          <NavLink to='/' end className={classes}>
            Search Artists
          </NavLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <NavLink to='/playlists' className={classes}>
            Playlists
          </NavLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <NavLink to='/genres' className={classes}>
            Genres
          </NavLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <NavLink to='/user' className={classes}>
            User
          </NavLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <NavLink to='/duplicates' className={classes}>
            Duplicates
          </NavLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  )
}

export default HeaderNav
