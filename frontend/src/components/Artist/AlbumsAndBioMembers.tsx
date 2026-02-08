import { TDiscogsBandMembersResponse } from '@/types/Discogs'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'
import IconBrand from '@/components/shared/icons/IconBrand'
import { TabsContent } from '@/components/ui/tabs'

import { getDiscogsArtistPageUrl } from '@/lib/get-discogs-artist-page-url'

type TAlbumsAndBioMembersProps = {
  artistMembers: TDiscogsBandMembersResponse
}

const AlbumsAndBioMembers = ({ artistMembers }: TAlbumsAndBioMembersProps): JSX.Element => {
  console.log(artistMembers)
  return (
    <TabsContent value="members" className="pt-16">
      <div>
        <Text variant="h2" className="flex gap-x-2 mb-8">
          Members from
          <IconBrand type="discogs" />
          <span className="text-orange-discogs">Discogs</span>
        </Text>
        {artistMembers.members && artistMembers.members.length > 0 ? (
          <div className="flex flex-col gap-y-4">
            {artistMembers.members.map((member) => (
              <div key={member.id} className="flex items-center">
                {member.thumbnail_url ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={member.thumbnail_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-gray-900 flex-shrink-0" />
                )}
                <div className="pl-4">
                  <Text variant="h4" className="mb-2">
                    {member.name}
                  </Text>
                  <div className="flex items-center gap-x-6">
                    <Hyperlink
                      external
                      href={getDiscogsArtistPageUrl(member.resource_url)}
                      variant="title"
                      className="flex items-center gap-x-2"
                    >
                      <IconBrand type="discogs" className="text-inherit" /> Discogs
                    </Hyperlink>
                    <Hyperlink
                      external
                      href={`https://www.google.com/search?q=${encodeURIComponent(member.name)}`}
                      variant="title"
                      className="flex items-center gap-x-2"
                    >
                      <IconBrand type="google" className="text-inherit" /> Google
                    </Hyperlink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text color="muted">No member information available.</Text>
        )}
      </div>
    </TabsContent>
  )
}

export default AlbumsAndBioMembers
