import { type ComponentPropsWithoutRef, forwardRef } from "react"
import { cn } from "../helpers"

export const Hr = forwardRef<HTMLHRElement, ComponentPropsWithoutRef<"hr">>(
  ({ className, ...other }, ref) => {
    return (
      <hr
        {...other}
        ref={ref}
        className={cn("border-none h-0.5 w-20 bg-slate-6 mx-auto", className)}
      />
    )
  },
)
