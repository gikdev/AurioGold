import { captureException } from "@sentry/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { apiClientFetch } from "./core"
import type { APIClientFetchHookOptions, FetchStatus } from "./types"
import { ERROR_MSGS } from "./types"

export function useAPIClientFetch<OutputData, RawData = unknown>(
  optionsFn: () => APIClientFetchHookOptions<OutputData, RawData>,
) {
  const optionsRef = useRef(optionsFn())
  optionsRef.current = optionsFn()
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [outputData, setOutputData] = useState<OutputData | undefined>(
    optionsRef.current.defaultValue,
  )

  const isLoading = fetchStatus === "loading"
  const isSuccess = fetchStatus === "success"
  const isError = fetchStatus === "error"
  const isFull = isSuccess && Array.isArray(outputData) && !!outputData.length
  const isEmpty = isSuccess && Array.isArray(outputData) && !outputData.length

  const fetchData = useCallback(() => {
    setFetchStatus("loading")
    setErrorMsg(null)

    apiClientFetch<OutputData, RawData>({
      ...optionsRef.current,
      onError: err => {
        setFetchStatus("error")
        setErrorMsg(err ?? "")
        optionsRef.current.onError?.(err ?? "")
      },
      onSuccess: data => {
        setFetchStatus("success")
        setOutputData(data)
        try {
          optionsRef.current.onSuccess?.(data)
        } catch (err) {
          captureException(err)
          optionsRef.current.onError?.(ERROR_MSGS.GENERAL)
        }
      },
    })
  }, [])

  useEffect(fetchData, [...(optionsRef.current.depsArray || [])])

  return {
    errorMsg,
    data: outputData,
    reload: fetchData,
    setData: setOutputData,
    status: {
      status: fetchStatus,
      isLoading,
      isSuccess,
      isError,
      isFull,
      isEmpty,
    },
  }
}
