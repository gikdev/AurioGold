import { DEFAULT_ERROR_MESSAGES } from "./errors"
import type { ApiOptions, ApiResponse, GlobalConfigOptions } from "./types"
import { buildUrl, safeExecute } from "./utils"

interface ApiRequestProps<TOutput, TRaw> {
  options: ApiOptions<TOutput, TRaw>
  config?: GlobalConfigOptions
  signal?: AbortSignal
}

/**
 * Makes an API request with configurable options
 * @template TOutput - The expected output type
 * @template TRaw - The raw response type before transformation
 * @param {Object} params - Request parameters
 * @param {ApiOptions<TOutput, TRaw>} params.options - Request-specific options
 * @param {GlobalConfigOptions} [params.config] - Global configuration options
 * @param {AbortSignal} [params.signal] - Signal for request cancellation
 * @returns {Promise<ApiResponse<TOutput>>} The API response
 */
export async function apiRequest<TOutput = unknown, TRaw = unknown>({
  options,
  config,
  signal,
}: ApiRequestProps<TOutput, TRaw>): Promise<ApiResponse<TOutput>> {
  const { queryParams, body, transformResponse, onSuccess } = options

  const baseUrl = options.baseUrl || config?.baseUrl || ""
  const url = options.url || config?.url || ""
  const token = options.token || config?.token || ""
  const headers = { ...(config?.headers || {}), ...(options.headers || {}) }
  const method = options.method || config?.method || "GET"
  const skipAuth = options.skipAuth || config?.skipAuth || false
  const skipContentType = options.skipAuth || config?.skipContentType || false

  function handleErrorMsg(msg: string) {
    options?.onError?.(msg)
    config?.onError?.(msg)
    config?.handleErrorMsg?.(msg)
  }

  const fullUrl = buildUrl(baseUrl, url, queryParams)
  const requestHeaders: HeadersInit = {
    ...(skipAuth ? {} : { Authorization: `Bearer ${token}` }),
    ...(skipContentType ? {} : { "Content-Type": "application/json" }),
    ...headers,
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    body: typeof body === "function" ? body() : body,
    signal,
  }

  try {
    const res = await fetch(fullUrl, fetchOptions)
    const isJson = res.headers.get("Content-Type")?.includes("application/json")
    const raw = isJson ? await res.json() : await res.text()

    if (!res.ok) {
      const msg = typeof raw === "string" ? raw : raw?.message?.[0]
      const errorMessage =
        msg || DEFAULT_ERROR_MESSAGES[res.status] || DEFAULT_ERROR_MESSAGES.GENERAL
      handleErrorMsg?.(errorMessage)
      return { success: false, status: res.status, error: errorMessage, data: null }
    }

    const data = transformResponse ? transformResponse(raw as TRaw) : (raw as TOutput)
    safeExecute(
      () => onSuccess?.(data),
      () => handleErrorMsg?.(DEFAULT_ERROR_MESSAGES.GENERAL),
    )
    return { success: true, status: res.status, data, error: null }
  } catch (err: unknown) {
    const message = DEFAULT_ERROR_MESSAGES.NETWORK
    handleErrorMsg?.(message)
    return { success: false, status: 0, error: message, data: null }
  }
}
