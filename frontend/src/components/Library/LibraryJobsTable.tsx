import { AiOutlineDelete } from 'react-icons/ai'
import { FaCcDiscover, FaCheckCircle } from 'react-icons/fa'
import { IoWarningOutline } from 'react-icons/io5'
import { IoCloseSharp } from 'react-icons/io5'
import { LuEye } from 'react-icons/lu'

import Text from '@/components/shared/Text'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TLibraryJob } from '@/services/library/getLibraryJobs'

import { formatJobDate, formatJobDateCompact } from '@/lib/format-job-date'

type TLibraryJobsTableProps = {
  jobs: TLibraryJob[]
  jobId: string | null
  currentJobStatus: 'idle' | 'running' | 'completed' | 'failed'
  currentJobProgress: { completed: number; total: number; message?: string } | null
  loading: boolean
  savedJobs: Record<string, number>
  onPreview: (jobId: string) => void
  onDelete: (jobId: string) => void
  onSaveToIndexDB: (jobId: string) => void
}

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
                  {job.id?.slice(0, 14) || 'n/a'}...
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

                <TableCell className="flex items-center gap-4">
                  <button
                    className="text-2xl hover:text-blue-500"
                    onClick={() => onPreview(job.id)}
                    disabled={loading}
                  >
                    <LuEye />
                  </button>
                  <button
                    className="text-2xl hover:text-red-500"
                    onClick={() => onDelete(job.id)}
                    disabled={loading}
                  >
                    <AiOutlineDelete />
                  </button>
                </TableCell>

                <TableCell className="border-l-2 text-right">
                  {savedJobs[job.id] ? (
                    <span className="text-sm">
                      {formatJobDate(savedJobs[job.id])?.date}
                      <br />
                      {formatJobDate(savedJobs[job.id])?.time}
                    </span>
                  ) : (
                    <button
                      onClick={() => onSaveToIndexDB(job.id)}
                      className="text-2xl hover:text-blue-500"
                      disabled={loading}
                    >
                      <FaCcDiscover />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
  )
}
