import { TLibraryJob } from '@/types/Library'
import * as Tooltip from '@radix-ui/react-tooltip'
import { AiOutlineDelete } from 'react-icons/ai'
import { LuEye } from 'react-icons/lu'

interface LibraryJobsTableActionsProps {
  job: TLibraryJob
  loading: boolean
  onPreview: (jobId: string) => void
  onDelete: (jobId: string) => void
}

const LibraryJobsTableActions = ({
  job,
  loading,
  onPreview,
  onDelete,
}: LibraryJobsTableActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className="text-2xl hover:text-blue-500 px-2 py-1"
              onClick={() => onPreview(job.id)}
              disabled={loading}
            >
              <LuEye />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content className="bg-blue-500 text-white px-3 py-1 rounded text-sm mb-4">
            Preview job details
          </Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className="text-2xl hover:text-red-500 px-2 py-1"
              onClick={() => onDelete(job.id)}
              disabled={loading}
            >
              <AiOutlineDelete />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content className="bg-red-700 text-white px-3 py-1 rounded text-sm mb-4">
            Delete job
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

export default LibraryJobsTableActions
