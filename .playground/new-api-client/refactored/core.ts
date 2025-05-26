import { captureException } from "@sentry/react"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { currentUrlName, urls } from "../../../../stuffer.config.json"
import { logOut } from "../../../helpers"
import { type APIClientFetchOptions, ERROR_MSGS } from "./types"
import { buildHeaders, buildUrl, extractErrorMessage, safeCallback } from "./utils"

const BASE_URL = urls[currentUrlName]

export async function apiClientFetch<OutputData, RawData = unknown>({
  endpoint,
  method = "GET",
  body,
  queryParams,
  headersConfig = { auth: true, contentType: true },
  additionalHeaders,
  permissionGiver = () => true,
  onError = err => toast.error(err),
  onSuccess = () => {},
  onFinally = () => {},
  onBeforeStart,
  dataTransformer,
  fessionHandler,
  returnRes = false,
  returnData = false,
  isLoginForm = false,
  token,
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
}: APIClientFetchOptions<OutputData, RawData>): Promise<OutputData | Response | void> {
  if (!permissionGiver()) return

  const url = buildUrl(BASE_URL, endpoint, queryParams)
  const headers = buildHeaders(headersConfig, additionalHeaders, token || Cookies.get("ttkk"))
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: typeof body === "function" ? body() : body,
  }

  safeCallback(onBeforeStart, onError)

  const fessionData = safeCallback(() => fessionHandler?.(), onError)
  if (fessionData) return safeCallback(() => onSuccess(fessionData), onError)

  try {
    const res = await fetch(url, fetchOptions)
    if (returnRes) return res

    const isJSON = (res.headers.get("Content-Type") || "").includes("application/json")

    if (!res.ok) {
      const errBody = isJSON ? await res.json() : await res.text()
      const errorMsg = extractErrorMessage(errBody, res.status)

      if (res.status === 401) {
        if (isLoginForm) {
          onError("نام کاربری یا رمز عبور اشتباه است")
          return
        }
        logOut()
        return
      }

      captureException(errorMsg)
      onError(errorMsg)
      return
    }

    const rawData = isJSON ? await res.json() : await res.text()
    const finalData = dataTransformer
      ? dataTransformer(rawData as RawData)
      : (rawData as OutputData)

    onSuccess(finalData)
    if (returnData) return finalData
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (err: any) {
    captureException(err)
    if (err?.name === "AbortError") return
    if (err?.message?.includes("Failed to fetch")) return onError(ERROR_MSGS.NETWORK)
    if (err?.message?.includes("timeout")) return onError(ERROR_MSGS.TIMEOUT)
    onError(ERROR_MSGS.GENERAL)
  } finally {
    safeCallback(onFinally, onError)
  }
}
