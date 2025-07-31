import { useEffect, useRef } from "react"

// biome-ignore lint/suspicious/noConfusingVoidType: false positive
export function useEffectButNotOnMount(fn: () => void | (() => void), deps: unknown[]) {
  const timeRef = useRef(0)

  useEffect(() => {
    timeRef.current++
    if (timeRef.current === 1) return
    return fn()
  }, [...deps, fn])
}
