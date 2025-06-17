import { forwardRef } from "react"

export const Radio = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ checked, className = "", ...props }, ref) => {
    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input type="radio" className="sr-only" checked={checked} ref={ref} {...props} />
        <span
          className={`
            w-5 h-5 rounded-full border transition-all flex 
            ${checked ? "border-brand-9" : "border-slate-7"}
            ${checked ? "bg-brand-3" : "bg-slate-3"}
            items-center justify-center
            after:size-3 after:rounded-full
            ${checked ? "after:bg-brand-9" : "after:bg-slate-3"}
            after:transition-all after:inline-block 
          `}
        />
      </label>
    )
  },
)

Radio.displayName = "Radio"
