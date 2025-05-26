import type { ButtonHTMLAttributes, ElementType } from "react"
import { styled } from "../helpers"

const styles = {
  base: `
    rounded h-10 px-4 active:scale-90 transition-all 
    flex items-center justify-center gap-2 disabled:bg-slate-3 
    disabled:text-slate-11 disabled:opacity-50
    disabled:active:scale-100 disabled:cursor-not-allowed
  `,
  filled: {
    success: "bg-jadedark-10 text-jadedark-1",
    error: "bg-reddark-10 text-reddark-1",
    warning: "bg-yellowdark-10 text-yellowdark-1",
    info: "bg-bluedark-10 text-bluedark-1",
    primary: "bg-amberdark-9 text-amberdark-1",
    neutral: "bg-slatedark-12 text-slatedark-1",
  },
  outline: {
    success: "bg-jadedark-3 text-jadedark-11",
    error: "bg-reddark-3 text-reddark-11",
    warning: "bg-yellowdark-3 text-yellowdark-11",
    info: "bg-bluedark-3 text-bluedark-11",
    primary: "bg-amberdark-3 text-amberdark-11",
    neutral: "bg-slatedark-3 text-slatedark-11",
  },
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: ElementType
  themeType?: Exclude<keyof typeof styles, "base">
  theme?: keyof (typeof styles)["filled"]
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
