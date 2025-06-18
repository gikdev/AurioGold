import { type ComponentPropsWithoutRef, forwardRef } from "react"
import { cn } from "../helpers"

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<"input">>(
  ({ className, ...other }, ref) => {
    return (
      <input
        {...other}
        ref={ref}
        className={cn(
          "px-4 py-3 bg-slate-3 border border-slate-7",
          "rounded text-slate-11 w-full focus:border-amber-8",
          "focus:bg-slate-5 focus:text-slate-12 transition-all",
          className,
        )}
      />
    )
  },
)
