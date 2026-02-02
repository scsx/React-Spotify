import { TSpotifyUser } from '@/types/SpotifyUser'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserLoggedInProps {
  user: TSpotifyUser | null
  logout: () => void
}

const getUserInitials = (
  displayName: string | null | undefined,
  id: string | null | undefined
): string => {
  if (displayName) {
    const parts = displayName.split(' ').filter(Boolean)
    if (parts.length === 0) {
      return id || 'U'
    }
    const initials = parts.map((part) => part[0].toUpperCase()).join('')
    return initials
  }
  return id || 'U'
}

const UserLoggedIn = ({ user, logout }: UserLoggedInProps): JSX.Element => {
  const initials = user ? getUserInitials(user.display_name, user.id) : 'U'

  return (
    <div className="flex items-center gap-2 bg-black/10 dark:bg-black/10 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 pl-4 rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 cursor-pointer">
            <Text variant="paragraph" as="span" color="foreground" className="text-inherit">
              Hi {initials}
            </Text>
            {user?.images && user.images.length > 0 ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.images[0].url} alt={user.display_name || 'User Profile'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 mt-2" align="end">
          <DropdownMenuItem className="p-0">
            <Hyperlink href="/user" className="py-[6px] px-2">
              Profile
            </Hyperlink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className='cursor-pointer'>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserLoggedIn
