import { useCallback, useEffect, useRef, useState } from "react"
import { useDatapiConfigContext } from "./context"
import { apiRequest } from "./request"
import type { ApiHookOptions, ApiResponse } from "./types"

export function useApiRequest<TOutput = unknown, TRaw = unknown>(
  optionsFn: () => ApiHookOptions<TOutput, TRaw>,
) {
  const config = useDatapiConfigContext()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState(false)
  const optionsRef = useRef(optionsFn())
  optionsRef.current = optionsFn()
  const [output, setOutput] = useState<ApiResponse<TOutput>>({
    error: null,
    status: null,
    success: false,
    data: optionsRef.current.defaultValue,
  })

  const handleErrorMsg = useCallback(
    (msg: string) => {
      if (
        !("onError" in optionsRef.current) &&
        config &&
        !("onError" in config) &&
        !("handleErrorMsg" in config) &&
        "handleFallbackErrorMsg" in config &&
        config.handleFallbackErrorMsg
      ) {
        config.handleFallbackErrorMsg(msg)
      }

      optionsRef.current?.onError?.(msg)
      config?.onError?.(msg)
      config?.handleErrorMsg?.(msg)
    },
    [config],
  )

  const fetchData = useCallback(async () => {
    let canRun: boolean | undefined = true

    try {
      canRun = await optionsRef.current.shouldRun?.()

      if (optionsRef.current.shouldRun && canRun === false) return
    } catch (_err) {
      handleErrorMsg("shouldRun FAILED!!!")
      console.error("shouldRun FAILED!!!")
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      const result = await apiRequest<TOutput, TRaw>({ options: optionsRef.current, config })
      setOutput(result)
    } finally {
      setLoading(false)
    }
  }, [config, handleErrorMsg])

  useEffect(() => {
    fetchData()

    return () => abortControllerRef.current?.abort()
  }, [...(optionsRef.current.dependencies || []), fetchData])

  return {
    ...output,
    reload: fetchData,
    loading,
  }
}
