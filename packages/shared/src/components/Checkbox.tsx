import { forwardRef } from "react"

export const Checkbox = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ checked, className = "", ...props }, ref) => {
    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input type="checkbox" className="peer sr-only" checked={checked} ref={ref} {...props} />
        <div className="w-5 h-5 rounded-md border border-slate-7 bg-slate-3 peer-checked:bg-brand-9 peer-checked:border-brand-9 transition-colors flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </label>
    )
  },
)

Checkbox.displayName = "Checkbox"
