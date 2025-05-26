import { ERROR_MSGS, type ErrorMsgKey } from "./types"

export function buildUrl(
  baseUrl: string,
  endpoint: string,
  queryParams?: Record<string, string | number>,
) {
  let url = `${baseUrl}/api${endpoint}`

  if (queryParams) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(queryParams).map(([k, v]) => [k, String(v)])),
    ).toString()
    url += `?${params}`
  }

  return url
}

export function buildHeaders(
  config: { contentType?: boolean; auth?: boolean },
  additional?: Record<string, string>,
  token?: string | undefined,
): HeadersInit {
  return {
    ...(config.auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...(config.contentType ? { "Content-Type": "application/json" } : {}),
    ...additional,
  }
}

export function extractErrorMessage(
  errorBody: string | { message?: string[] },
  status: number,
): string {
  const msg =
    typeof errorBody === "string"
      ? errorBody
      : errorBody.message?.[0] || ERROR_MSGS[status as ErrorMsgKey] || ERROR_MSGS.GENERAL
  return msg.trim() === "" ? ERROR_MSGS.GENERAL_SIMPLE : msg
}

export function safeCallback<T>(
  fn: (() => T | undefined) | undefined,
  onError?: (msg: string) => void,
): T | undefined {
  try {
    return fn?.()
  } catch (err) {
    console.error(err)
    if (onError) onError(ERROR_MSGS.GENERAL)
  }
}
