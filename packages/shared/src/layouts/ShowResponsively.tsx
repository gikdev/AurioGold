import type { ReactNode } from "react"
import { useIsMobile } from "#shared/hooks"

export function ShowResponsively({ mobile, pc }: { pc: ReactNode; mobile: ReactNode }) {
  const isMobile = useIsMobile()

  return isMobile ? mobile : pc
}
