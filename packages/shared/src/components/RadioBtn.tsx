import styled from "@master/styled.react"
import { forwardRef } from "react"

export const Radio = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ checked, className = "", ...props }, ref) => {
    const StyledRing = styled.span`
      w-5 h-5 rounded-full 
      inline-block border transition-colors
      border-slate-7 bg-slate-3
      peer-checked:border-brand-9
      peer-checked:bg-brand-3
    `
    const StyledCenter = styled.span`
      h-3 w-3 rounded-full absolute
      bg-slate-3 top-1 left-1
      peer-checked:bg-brand-9
      transition-colors inline-block 
    `

    return (
      <label className={`relative w-5 h-5 cursor-pointer ${className}`}>
        <input type="radio" className="sr-only peer" checked={checked} ref={ref} {...props} />
        <StyledRing />
        <StyledCenter />
      </label>
    )
  },
)

Radio.displayName = "Radio"
