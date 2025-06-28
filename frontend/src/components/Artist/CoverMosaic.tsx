import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CoverMosaicProps {
  covers: string[]
}

const CoverMosaic: React.FC<CoverMosaicProps> = ({ covers }): JSX.Element => {
  return (
    <Dialog>
      <div className="inline-flex h-10 rounded-md bg-muted ml-4 p-1 text-muted-foreground mb-4">
        <DialogTrigger className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-background">
          Mosaic
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-6xl">
        <ScrollArea className="h-[90vh] p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {covers.map((url) => {
              return <img key={url} src={url} />
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CoverMosaic
