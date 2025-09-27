export function formatPersianPrice(numberStr: string | number): string {
  if (!numberStr) return ""

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  // Convert Persian to English digits
  let englishNumber = numberStr.toString()
  for (let i = 0; i < persianDigits.length; i++) {
    englishNumber = englishNumber.replace(new RegExp(persianDigits[i], "g"), englishDigits[i])
  }

  // Add commas manually using regex
  const withCommas = englishNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  // Convert back to Persian
  let result = withCommas
  for (let i = 0; i < englishDigits.length; i++) {
    result = result.replace(new RegExp(englishDigits[i], "g"), persianDigits[i])
  }

  return result
}

export function formatPersianString(numberStr: string | number): string {
  if (!numberStr) return ""

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  let result = numberStr.toString()

  for (let i = 0; i < persianDigits.length; i++) {
    result = result.replace(new RegExp(persianDigits[i], "g"), englishDigits[i])
  }

  for (let i = 0; i < englishDigits.length; i++) {
    result = result.replace(new RegExp(englishDigits[i], "g"), persianDigits[i])
  }

  return result
}
