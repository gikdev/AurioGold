export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export type ApiResponse<T = unknown> = {
  success: boolean
  data: T | null
  status: number | null
  error: string | null
}

export interface ApiOptions<TOutput = unknown, TRaw = unknown> {
  baseUrl?: string
  url?: string
  method?: HttpMethod
  queryParams?: Record<string, string | number>
  body?: string | FormData | (() => string | FormData)
  headers?: Record<string, string>
  token?: string
  transformResponse?: (raw: TRaw) => TOutput
  skipAuth?: boolean
  skipContentType?: boolean
  onSuccess?(data: TOutput): void
  onError?(message: string): void
}

export interface ApiHookOptions<TOutput, TRaw = unknown> extends ApiOptions<TOutput, TRaw> {
  defaultValue: TOutput
  dependencies?: unknown[]
}

type GloballyConfigurableOptions = Partial<
  Pick<
    ApiOptions,
    "headers" | "onError" | "skipAuth" | "skipContentType" | "token" | "url" | "method"
  >
>

export interface GlobalConfigOptions extends GloballyConfigurableOptions {
  baseUrl?: string
  handleErrorMsg?: (msg?: string) => void
}
