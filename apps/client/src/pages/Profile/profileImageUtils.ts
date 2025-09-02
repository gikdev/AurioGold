import type { Ufm } from "@repo/api-client"

export function objToKeyVal(obj: Record<string, string | null>) {
  return {
    dataVal: Object.keys(obj).map(key => ({
      key: capitalize(key),
      val: obj[key],
    })),
  } satisfies Ufm
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export function loweralize(input: string) {
  return input.charAt(0).toLowerCase() + input.slice(1)
}
