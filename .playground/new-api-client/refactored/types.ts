export interface APIDataWrapper<T = unknown> {
  data: T
  status: string
  message: string[]
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export const ERROR_MSGS: Record<string | number, string> = {
  400: "درخواست نامعتبر، لطفاً ورودی را بررسی کنید.",
  401: "دسترسی غیرمجاز؛ لطفاً دوباره وارد شوید.",
  403: "ممنوع؛ شما اجازه دسترسی ندارید.",
  404: "یافت نشد، لطفاً آدرس را بررسی کنید.",
  408: "زمان درخواست تمام شد، لطفاً دوباره تلاش کنید.",
  409: "تضاد؛ داده‌ای که تلاش می‌کنید ایجاد کنید از قبل وجود دارد.",
  422: "خطای اعتبارسنجی؛ لطفاً داده‌های ارائه‌شده را بررسی کنید.",
  500: "خطای سرور، لطفاً بعداً دوباره تلاش کنید.",
  501: "پیاده‌سازی نشده؛ سرور از این قابلیت پشتیبانی نمی‌کند.",
  502: "دروازه بد؛ سرور در اتصال به خدمات بالادستی مشکل دارد.",
  503: "سرویس در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.",
  504: "زمان اتصال در دروازه تمام شد؛ سرور خیلی طول کشید تا پاسخ دهد.",
  GENERAL: "خطای ناشناخته؛ لطفاً بعداً دوباره تلاش کنید. (ممکن است به دلیل استفاده از فیلترشکن باشد)",
  GENERAL_SIMPLE: "خطای ناشناخته؛ لطفاً بعداً دوباره تلاش کنید.",
  NETWORK: "خطای شبکه؛ مطمئن شوید که به اینترنت متصل هستید.",
  PARSE: "تجزیه پاسخ سرور ناموفق بود؛ لطفاً دوباره تلاش کنید.",
  TIMEOUT: "زمان درخواست تمام شد؛ لطفاً دوباره تلاش کنید.",
}

export type ErrorMsgKey = keyof typeof ERROR_MSGS

export type FetchStatus = "loading" | "error" | "success" | "idle"

export interface APIClientFetchOptions<OutputData, RawData> {
  endpoint: string
  method?: HTTPMethod | string
  body?: string | FormData | (() => string | FormData)
  additionalHeaders?: Record<string, string>
  queryParams?: Record<string, string | number>
  headersConfig?: { contentType?: boolean; auth?: boolean }
  permissionGiver?(): boolean
  onSuccess?(data: OutputData): void
  onError?(error?: string): void
  onFinally?(): void
  onBeforeStart?(): void
  dataTransformer?: (input: RawData) => OutputData
  fessionHandler?: () => OutputData | undefined | null
  returnRes?: boolean
  returnData?: boolean
  isLoginForm?: boolean
  token?: string
}

export interface APIClientFetchHookOptions<OutputData, RawData>
  extends APIClientFetchOptions<OutputData, RawData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  depsArray?: any[]
  defaultValue?: OutputData
}
