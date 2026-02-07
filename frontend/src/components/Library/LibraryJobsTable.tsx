import { TLibraryJobsTableProps } from '@/types/Library'
import { FaCheckCircle } from 'react-icons/fa'
import { IoWarningOutline } from 'react-icons/io5'
import { IoCloseSharp } from 'react-icons/io5'

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

import LibraryJobsTableActions from './LibraryJobsTableActions'
import LibraryJobsTableSave from './LibraryJobsTableSave'

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
  onDownloadJob,
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
              <Text>No jobs in history</Text>
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
                <TableCell>
                  <div
                    className={`text-lg h-full flex flex-col items-center ${
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
                  </div>
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

                <TableCell>
                  <LibraryJobsTableActions
                    job={job}
                    loading={loading}
                    onPreview={onPreview}
                    onDelete={onDelete}
                  />
                </TableCell>

                <TableCell>
                  <LibraryJobsTableSave
                    job={job}
                    savedJobs={savedJobs}
                    loading={loading}
                    onSaveToIndexDB={onSaveToIndexDB}
                    onDownloadJob={onDownloadJob}
                  />
                </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  )
}
