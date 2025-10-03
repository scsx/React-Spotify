// Removes characters like accents and converts to lowercase
export const normalizeString = (str: string): string => {
  if (!str) return ''
  return str
    .normalize('NFD') // Decompõe a string (ex: 'á' -> 'a' + acento)
    .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
    .toLowerCase()
}
