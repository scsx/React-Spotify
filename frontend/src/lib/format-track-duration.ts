export const formatTrackDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const formattedSeconds = String(seconds).padStart(2, '0')
  return `${minutes}:${formattedSeconds}`
}