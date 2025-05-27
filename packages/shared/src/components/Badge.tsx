import type { ElementType, ReactNode } from "react"
import { styled } from "../helpers"

const styles = {
  base: "inline-block rounded px-2 py-1 text-xs",
  success: "bg-jade-3 text-jade-11",
  error: "bg-red-3 text-red-11",
  warning: "bg-yellow-3 text-yellow-11",
  info: "bg-blue-3 text-blue-11",
  primary: "bg-amber-3 text-amber-11",
  neutral: "bg-slate-3 text-slate-11",
}

interface BadgeProps {
  as: ElementType
  className?: string
  theme?: Exclude<keyof typeof styles, "base">
  children?: ReactNode
}

export function Badge({
  as = "span",
  className = "",
  theme = "neutral",
  children,
  ...delegated
}: BadgeProps) {
  const StyledTag = styled(as, styles.base, styles[theme], className)

  return <StyledTag {...delegated}>{children}</StyledTag>
}
