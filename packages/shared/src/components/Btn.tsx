import { type HTMLMotionProps, motion } from "motion/react"
import type { ElementType } from "react"
import { cn } from "#shared/helpers"

const styles = {
  base: `
    rounded min-h-10 py-2 px-4 active:scale-95 
    flex items-center justify-center gap-1
    disabled:bg-slate-3 disabled:text-slate-11
    disabled:opacity-50 disabled:active:scale-100
    disabled:cursor-not-allowed select-none
    cursor-pointer disabled:border-slate-6
    *:shrink-0 *:break-all font-bold
  `,
  filled: {
    success: "bg-green-9 text-slate-12",
    error: "bg-red-9 text-slate-12",
    warning: "bg-yellow-9 text-slate-1",
    info: "bg-blue-9 text-slate-12",
    primary: "bg-brand-9 text-slate-1",
    neutral: "bg-slate-12 text-slate-1",
  },
  outline: {
    success: "bg-jade-3 text-jade-11 border border-jade-7",
    error: "bg-red-3 text-red-11 border border-red-7",
    warning: "bg-yellow-3 text-yellow-11 border border-yellow-7",
    info: "bg-blue-3 text-blue-11 border border-blue-7",
    primary: "bg-brand-3 text-brand-11 border border-brand-7",
    neutral: "bg-slate-3 text-slate-11 border border-slate-7",
  },
}

interface BtnProps extends HTMLMotionProps<"button"> {
  as?: ElementType
  themeType?: Exclude<keyof typeof styles, "base">
  theme?: keyof (typeof styles)["filled"]
  href?: string
  to?: string
}

export function Btn({
  as: Tag = "button",
  className = "",
  themeType = "outline",
  theme = "neutral",
  children = null,
  ...other
}: BtnProps) {
  const classes = cn(styles.base, styles[themeType][theme], className)

  const MotionTag = motion.create(Tag)

  return (
    <MotionTag
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      {...other}
      className={classes}
    >
      {children}
    </MotionTag>
  )
}
