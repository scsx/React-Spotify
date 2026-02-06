import { toPng } from 'html-to-image'
import { LiaFileExportSolid } from 'react-icons/lia'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type CoverMosaicProps = {
  covers: string[]
  artistName: string
}

const CoverMosaic: React.FC<CoverMosaicProps> = ({ covers, artistName }): JSX.Element => {
  const exportMosaic = async () => {
    const node = document.getElementById('cover-mosaic')
    if (!node) return

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
    })

    const link = document.createElement('a')
    const safeName = artistName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    link.download = `${safeName}-cover-mosaic.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <Dialog>
      <div className="inline-flex h-10 rounded-md bg-muted ml-4 p-1 text-muted-foreground mb-4">
        <DialogTrigger className="inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-background">
          Mosaic
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-6xl [&>button]:scale-150 [&>button]:-right-8 [&>button]:top-6">
        <DialogTitle className="sr-only">Album Covers Mosaic</DialogTitle>
        <ScrollArea className="h-[90vh] p-4 pt-0">
          <Button
            onClick={exportMosaic}
            variant="outline"
            size="sm"
            className="mb-4 text-indigo-700 dark:text-white border-indigo-700 hover:bg-indigo-700"
          >
            Export mosaic to png <LiaFileExportSolid />
          </Button>

          <div className="grid grid-cols-2 lg:grid-cols-4" id="cover-mosaic">
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
