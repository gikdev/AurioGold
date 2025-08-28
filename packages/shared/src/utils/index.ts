export * from "./persianNumberFormatter"
export * from "./types"

export class Nothing {
  /** Does NOTHING! (I swear it's USEFUL...!) */
  public static dontDoAnything(..._input: unknown[]) {
    // Do Nothing...
  }
}

export function toNullableNumber(input: string | null | undefined) {
  if (!input) return null
  const convertedInput = Number(input)
  if (Number.isNaN(convertedInput)) return null
  return convertedInput
}

export function toSafeNumber(input: string | null | undefined | number, fallback = 0): number {
  if (!input) return fallback
  const convertedInput = Number(input)
  if (Number.isNaN(convertedInput)) return fallback
  return convertedInput
}
