import { type ComponentPropsWithoutRef, forwardRef } from "react"
import { cn } from "../helpers"

export const TextArea = forwardRef<HTMLTextAreaElement, ComponentPropsWithoutRef<"textarea">>(
  ({ className, ...other }, ref) => {
    return (
      <textarea
        {...other}
        ref={ref}
        className={cn(
          "px-4 py-3 bg-slate-3 border border-slate-6",
          "transition-colors rounded text-slate-11 w-full",
          "outline-0 min-h-10 focus:border-brand-8",
          "focus:bg-slate-5 focus:text-slate-12",
          className,
        )}
      />
    )
  },
)
