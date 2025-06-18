import { useEffect, useRef } from "react"

// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
export function useEffectButNotOnMount(fn: () => void | (() => void), deps: unknown[]) {
  const timeRef = useRef(0)

  useEffect(() => {
    timeRef.current++
    if (timeRef.current === 1) return
    return fn()
  }, [...deps, fn])
}
