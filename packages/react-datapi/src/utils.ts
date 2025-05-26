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
