import { ImStatsBars } from 'react-icons/im'
import { MdOutlineNotes } from 'react-icons/md'
import { TbPackageExport } from 'react-icons/tb'

import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

const LikedSongsSecNav = () => {
  return (
    <ul className="flex flex-col gap-y-1">
      <Text as="li">
        <Hyperlink href="/playlists/liked-songs/feature-stats" variant="title" className="flex items-center gap-x-2">
          <ImStatsBars />
          Feature Stats
        </Hyperlink>
      </Text>
      <Text as="li">
        <Hyperlink
          href="https://skiley.net/playlists"
          variant="title"
          external
          className="flex items-center gap-x-2"
        >
          <TbPackageExport />
          Using skiley.net
        </Hyperlink>
      </Text>
      <Text as="li">
        <Hyperlink href="/dev-notes#skiley" variant="title" className="flex items-center gap-x-2">
          <MdOutlineNotes />
          Dev notes
        </Hyperlink>
      </Text>
    </ul>
  )
}

export default LikedSongsSecNav
