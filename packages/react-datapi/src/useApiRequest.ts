import { useCallback, useEffect, useRef, useState } from "react"
import { apiRequest } from "./request"
import type { ApiHookOptions, ApiResponse } from "./types"
import { useDatapiConfigContext } from "./context"

export function useApiRequest<TOutput = unknown, TRaw = unknown>(
  optionsFn: () => ApiHookOptions<TOutput, TRaw>,
) {
  const config = useDatapiConfigContext()
  const abortControllerRef = useRef<AbortController>(null)
  const [loading, setLoading] = useState(false)
  const optionsRef = useRef(optionsFn())
  optionsRef.current = optionsFn()
  const [output, setOutput] = useState<ApiResponse<TOutput>>({
    error: null,
    status: null,
    success: false,
    data: optionsRef.current.defaultValue,
  })

  const fetchData = useCallback(async () => {
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
  }, [config])

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
