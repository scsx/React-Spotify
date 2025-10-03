export const formatSkileyTrackDuration = (ms: string) => {
  if (!ms) return 'N/A'

  const [minutes, seconds] = ms.split(':')

  return `${parseInt(minutes, 10)}:${seconds}`
}
