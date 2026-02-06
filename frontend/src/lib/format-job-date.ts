export function formatJobDate(
  timestamp: number | null | undefined
): { date: string; time: string } | null {
  if (!timestamp) return null

  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return {
    date: `${year}/${month}/${day}`,
    time: `${hours}:${minutes}`,
  }
}

export function formatJobDateCompact(timestamp: number | null | undefined): string | null {
  if (!timestamp) return null

  const now = new Date()
  const jobDate = new Date(timestamp)
  const daysAgo = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24))

  const month = String(jobDate.getMonth() + 1).padStart(2, '0')
  const day = String(jobDate.getDate()).padStart(2, '0')

  return `${day}/${month} (${daysAgo === 0 ? 'today' : `${daysAgo}d`})`
}
