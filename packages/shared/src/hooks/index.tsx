import { useWindowSize } from "react-haiku"

export function useIsMobile() {
  const TARGET_WIDTH = 768
  const { width } = useWindowSize()

  return width < TARGET_WIDTH
}
