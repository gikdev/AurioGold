import { forwardRef } from "react"

export const Switch = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ checked, className = "", ...props }, ref) => {
    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input type="checkbox" className="sr-only" checked={checked} ref={ref} {...props} />

        {/* TRACK */}
        <span
          className={`w-12 h-7 ${checked ? "bg-brand-9" : "bg-slate-6"} rounded-full transition-colors`}
        />

        {/* THUMB */}
        <span
          className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transform ${checked ? "translate-x-5" : ""} transition-transform`}
        />
      </label>
    )
  },
)

Switch.displayName = "Switch"
