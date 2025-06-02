import type { ButtonHTMLAttributes, ElementType } from "react"
import { styled } from "../helpers"

const styles = {
  base: `
    rounded h-10 px-4 active:scale-95 
    flex items-center justify-center gap-2 disabled:bg-slate-3 
    disabled:text-slate-11 disabled:opacity-50
    disabled:active:scale-100 disabled:cursor-not-allowed
    select-none cursor-pointer
  `,
  filled: {
    success: "bg-jade-10 text-jade-1",
    error: "bg-red-10 text-red-1",
    warning: "bg-yellow-10 text-yellow-1",
    info: "bg-blue-10 text-blue-1",
    primary: "bg-amber-9 text-amber-1",
    neutral: "bg-slate-12 text-slate-1",
  },
  outline: {
    success: "bg-jade-3 text-jade-11",
    error: "bg-red-3 text-red-11",
    warning: "bg-yellow-3 text-yellow-11",
    info: "bg-blue-3 text-blue-11",
    primary: "bg-amber-3 text-amber-11",
    neutral: "bg-slate-3 text-slate-11",
  },
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType
  themeType?: Exclude<keyof typeof styles, "base">
  theme?: keyof (typeof styles)["filled"]
  href?: string
  to?: string
}

export function Btn({
  as = "button",
  className = "",
  themeType = "outline",
  theme = "neutral",
  children = null,
  ...delegated
}: BtnProps) {
  const StyledTag = styled(as, styles.base, styles[themeType][theme], className)

  return <StyledTag {...delegated}>{children}</StyledTag>
}
