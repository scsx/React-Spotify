export const getFirstNameAndLastInitial = (displayName: string | null | undefined): string => {
  if (displayName) {
    const parts = displayName.split(' ').filter(Boolean)
    if (parts.length === 0) {
      return ''
    }
    const firstName = parts[0]
    if (parts.length > 1) {
      const lastInitial = parts[parts.length - 1][0].toUpperCase()
      return `${firstName} ${lastInitial}.`
    }
    return firstName
  }
  return ''
}
