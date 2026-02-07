import { TLibraryJob } from '@/types/Library'
import * as Tooltip from '@radix-ui/react-tooltip'
import { IoMdDownload } from 'react-icons/io'
import { LuDatabaseBackup } from 'react-icons/lu'

import Text from '@/components/shared/Text'

import { formatJobDateCompact } from '@/lib/format-job-date'

interface LibraryJobsTableSaveProps {
  job: TLibraryJob
  savedJobs: Record<string, number>
  loading: boolean
  onSaveToIndexDB: (jobId: string) => void
  onDownloadJob: (jobId: string) => void
}

const LibraryJobsTableSave = ({
  job,
  savedJobs,
  loading,
  onSaveToIndexDB,
  onDownloadJob,
}: LibraryJobsTableSaveProps) => {
  return (
    <div className="border-l-2 text-right">
      {savedJobs[job.id] ? (
        (() => {
          const formatted = formatJobDateCompact(savedJobs[job.id])
          if (!formatted) return 'n/a'
          const [date, daysAgo] = formatted.split(' ')
          return (
            <>
              <div className="flex gap-x-2 justify-end items-center">
                <Text className="text-sm">Saved at {date}</Text>
                <Text className="text-sm">{daysAgo}</Text>
              </div>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="flex gap-x-2 justify-end items-center mt-2 cursor-pointer hover:text-primary w-full px-2 py-1"
                      onClick={() => onDownloadJob(job.id)}
                    >
                      <Text className="text-sm hover:text-primary">Download as JSON</Text>
                      <IoMdDownload className="text-2xl" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content className="bg-green-600 px-3 py-1 rounded text-sm mb-4">
                    Download as JSON
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </>
          )
        })()
      ) : (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => onSaveToIndexDB(job.id)}
                className="text-xl hover:text-primary"
                disabled={loading}
              >
                <LuDatabaseBackup />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-blue-500 px-3 py-1 rounded text-sm mb-4">
              Save to IndexDB (browser)
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  )
}

export default LibraryJobsTableSave
