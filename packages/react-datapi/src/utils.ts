export function buildUrl(base = "", path = "", params?: Record<string, string | number>) {
  let urlStr = `${base}${path}`

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()

    for (const [key, val] of Object.entries(params)) {
      searchParams.append(key, String(val))
    }

    urlStr += (urlStr.includes("?") ? "&" : "?") + searchParams.toString()
  }

  return urlStr
}

export function safeExecute<T>(fn: (() => T) | undefined, fallback?: () => void): T | undefined {
  try {
    return fn?.()
  } catch (error) {
    fallback?.()
  }
}

export const extractMessage = (input: unknown): string => {
  if (typeof input === "string") return input
  if (!input) return ""

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  if (typeof (input as any).message === "string") return (input as any).message

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  if (Array.isArray((input as any).message) && typeof (input as any).message[0] === "string")
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return (input as any).message[0]

  return ""
}
