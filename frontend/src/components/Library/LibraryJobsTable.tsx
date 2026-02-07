import { TLibraryJobsTableProps } from '@/types/Library'
import * as Tooltip from '@radix-ui/react-tooltip'
import { AiOutlineDelete } from 'react-icons/ai'
import { FaCheckCircle } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'
import { IoWarningOutline } from 'react-icons/io5'
import { IoCloseSharp } from 'react-icons/io5'
import { LuDatabaseBackup, LuEye } from 'react-icons/lu'

import Text from '@/components/shared/Text'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { formatJobDateCompact } from '@/lib/format-job-date'

export default function LibraryJobsTable({
  jobs,
  jobId,
  currentJobStatus,
  currentJobProgress,
  loading,
  savedJobs,
  onPreview,
  onDelete,
  onSaveToIndexDB,
}: TLibraryJobsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="leading-none">
            View or
            <br />
            Delete
          </TableHead>
          <TableHead className="border-l-2 leading-none text-right">
            Saved
            <br />
            to IndexDB
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobId && (
          <TableRow className="bg-blue-500">
            <TableCell className="font-mono text-sm">{jobId?.slice(0, 14) || 'n/a'}...</TableCell>
            <TableCell className="flex items-center">
              <span
                className={`text-lg inline-block ml-[15%] ${
                  currentJobStatus === 'completed'
                    ? 'text-green-600'
                    : currentJobStatus === 'failed'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}
              >
                {currentJobStatus === 'completed' ? (
                  <FaCheckCircle />
                ) : currentJobStatus === 'failed' ? (
                  <IoCloseSharp />
                ) : (
                  <IoWarningOutline />
                )}
              </span>
            </TableCell>
            <TableCell className="font-mono">
              {currentJobProgress
                ? `${currentJobProgress.completed || 0}/${currentJobProgress.total || 0}`
                : 'starting...'}
            </TableCell>
            <TableCell>
              <span className="text-sm">today</span>
            </TableCell>
            <TableCell></TableCell>
            <TableCell className="border-l-2"></TableCell>
          </TableRow>
        )}
        {jobs.length === 0 && !jobId ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-gray-400">
              No jobs in history
            </TableCell>
          </TableRow>
        ) : (
          [...jobs]
            .filter((job) => job.id !== jobId)
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            .map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-sm">
                  {job.id?.slice(0, 20) || 'n/a'}...
                </TableCell>
                <TableCell className="flex items-center">
                  <span
                    className={`text-lg inline-block ml-[15%] ${
                      job.status === 'completed'
                        ? 'text-green-600'
                        : job.status === 'failed'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}
                  >
                    {job.status === 'completed' ? (
                      <FaCheckCircle />
                    ) : job.status === 'failed' ? (
                      <IoCloseSharp />
                    ) : (
                      <IoWarningOutline />
                    )}
                  </span>
                </TableCell>
                <TableCell className="font-mono">
                  {job.progress
                    ? `${job.progress.completed || 0}/${job.progress.total || 0}`
                    : 'n/a'}
                </TableCell>
                <TableCell>
                  {(() => {
                    const formatted = formatJobDateCompact(job.createdAt)
                    if (!formatted) return 'n/a'
                    const [date, daysAgo] = formatted.split(' ')
                    return (
                      <div className="flex gap-x-2">
                        <Text>{date}</Text> <Text color="muted">{daysAgo}</Text>
                      </div>
                    )
                  })()}
                </TableCell>

                <TableCell className="flex items-center gap-2">
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
                </TableCell>

                <TableCell className="border-l-2 text-right">
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
                                <div className="flex gap-x-2 justify-end items-center mt-4 cursor-pointer hover:text-primary">
                                  <Text className="text-sm hover:text-primary">
                                    Download as JSON
                                  </Text>
                                  <button>
                                    <IoMdDownload className="text-2xl" />
                                  </button>
                                </div>
                              </Tooltip.Trigger>
                              <Tooltip.Content className="bg-green-600 px-3 py-1 rounded text-sm mb-4">
                                Download job data
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
                </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  )
}
