import { type ComponentPropsWithoutRef, forwardRef } from "react"
import { cn } from "../helpers"

export const Select = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<"select">>(
  ({ className, ...other }, ref) => {
    return (
      <select
        {...other}
        ref={ref}
        className={cn(
          "px-4 py-3 bg-slate-3 border border-slate-7",
          "rounded text-slate-11 focus:border-transparent",
          "focus:bg-slate-5 focus:text-slate-12",
          className,
        )}
      />
    )
  },
)
