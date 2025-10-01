export function formatNumberWithSeparators(
  value: number | string,
  locale: string = 'fr-FR',
  minimumFractionDigits: number = 0
): string {
  const num = Number(value)
  if (isNaN(num)) {
    return String(value)
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits,
    })

    return formatter.format(num)
  } catch (e) {
    return num.toString()
  }
}
