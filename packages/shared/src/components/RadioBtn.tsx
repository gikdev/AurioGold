import { forwardRef } from "react"

export const Radio = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ checked, className = "", ...props }, ref) => {
    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input type="radio" className="peer sr-only" checked={checked} ref={ref} {...props} />
        <div
          className="
            w-5 h-5 rounded-full border border-slate-7 bg-slate-3 peer-checked:border-brand-9 peer-checked:bg-brand-3 transition-colors flex items-center justify-center flex items-center justify-center
            after:w-3 after:h-3 after:rounded-full after:bg-brand-9 after:opacity-0 peer-checked:after:opacity-100 after:transition-opacity
            after:inline-block 
          "
        />
      </label>
    )
  },
)

Radio.displayName = "Radio"
