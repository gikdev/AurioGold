import { forwardRef } from "react"
import { ccn, cn } from "#shared/helpers"

const centerStyles = ccn(`
  h-3 w-3 rounded-full
  bg-slate-3 inline-block 
  peer-checked:bg-brand-9
  transition-colors
`)

export const Radio = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ checked, className = "", ...props }, ref) => {
    const stylesRing = cn(`
      w-5 h-5 rounded-full cursor-pointer
      border transition-colors
      border-slate-7 bg-slate-3
      flex items-center justify-center
      has-checked:border-brand-9
      has-checked:bg-brand-3
    `)

    return (
      <label className={stylesRing}>
        <input type="radio" className="sr-only peer" checked={checked} ref={ref} {...props} />
        <span {...centerStyles} />
      </label>
    )
  },
)

Radio.displayName = "Radio"
