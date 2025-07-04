import { TSpotifyUser } from '@/types/SpotifyUser'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'
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
    <div className="flex items-center gap-2 border pl-4 rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 cursor-pointer">
            <Text variant='paragraph' as='span' color='foreground'>Hi {initials}</Text>
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
        <DropdownMenuContent className="w-56 mt-4" align="end">
          <DropdownMenuItem>
            <Hyperlink href="/user">Profile</Hyperlink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserLoggedIn
