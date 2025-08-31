import clsx, { type ClassValue } from "clsx"
import { toast } from "react-toastify"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
export const ccn = (...inputs: ClassValue[]) => ({ className: twMerge(clsx(inputs)) })

type StrEnding = " *" | ": "

export function createFieldsWithLabels<T extends Record<string, `${string}${StrEnding}` | null>>(
  labels: T,
) {
  const fields = Object.fromEntries(Object.entries(labels).map(([key, _]) => [key, key])) as {
    [K in keyof T]: K
  }

  const rawLabels = {} as Record<keyof T, string | null>

  for (const key in labels) {
    rawLabels[key] = labels[key]?.slice(0, -2) ?? null
  }

  return { fields, labels, rawLabels }
}

interface ControlledToastMessages {
  pending: string
  success?: string
  error?: string
}

interface ControlledToastReturn<T> {
  resolve: (data?: T | string) => void
  reject: (err?: unknown) => void
}

/**
 * Creates a controlled toast for async operations using `react-toastify`.
 *
 * Returns `resolve` and `reject` functions to be called manually,
 * allowing precise control over when the toast transitions from
 * pending to success or error.
 *
 * @param initialMessages - Default messages for the toast states.
 * @returns An object containing `resolve` and `reject` functions.
 *
 * @example
 * const { resolve, reject } = createControlledToast({
 *   pending: "Sending request...",
 *   success: "Request successful!",
 *   error: "Something went wrong!",
 * })
 *
 * fetch("/api/submit")
 *   .then(() => resolve("Success with ✅"))
 *   .catch((err) => reject(err))
 */
export function createControlledAsyncToast<T = void>(
  initialMessages: ControlledToastMessages,
): ControlledToastReturn<T> {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  toast.promise(promise, {
    pending: initialMessages.pending,
    success: {
      render({ data }) {
        return typeof data === "string" ? data : (initialMessages.success ?? "با موفقیت انجام شد!")
      },
    },
    error: {
      render({ data }) {
        return parseError(data, initialMessages.error)
      },
    },
  })

  return {
    resolve: (data?: T | string) => resolve(data as T),
    reject: (err?: unknown) => reject(err),
  }
}

export function parseError(error: unknown, msg?: string) {
  if (typeof error === "string") {
    try {
      const parsed = JSON.parse(error)

      if (typeof parsed === "object" && parsed !== null) {
        if ("msg" in parsed && typeof parsed.msg === "string") return parsed.msg
        if ("message" in parsed && typeof parsed.message === "string") return parsed.message
        if ("name" in parsed && typeof parsed.name === "string") return parsed.name
        if ("title" in parsed && typeof parsed.title === "string") return parsed.title
        if ("status" in parsed && typeof parsed.status === "number") {
          if (parsed.status === 401)
            return "دسترسی نامعتبر هست، لطفا از حساب خارج شده و دوباره وارد شوید"
        }
      }
    } catch {
      return error
    }
  }

  if (typeof error === "object" && error !== null) {
    if ("msg" in error && typeof error.msg === "string") return error.msg
    if ("message" in error && typeof error.message === "string") return error.message
    if ("name" in error && typeof error.name === "string") return error.name
    if ("title" in error && typeof error.title === "string") return error.title
    if ("status" in error && typeof error.status === "number") {
      if (error.status === 401)
        return "دسترسی نامعتبر هست، لطفا از حساب خارج شده و دوباره وارد شوید"
    }
  }

  return msg || "خطایی رخ داد!"
}

export const isUndefinedOrNull = (sth: unknown) => typeof sth === "undefined" || sth === null
