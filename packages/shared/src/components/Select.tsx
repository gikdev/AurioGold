import { type SelectHTMLAttributes, forwardRef } from "react"
import { styled } from "#shared/helpers"

export const StyledSelect = styled(
  "select",
  `
    px-4 py-3 bg-slate-3 border border-slate-7 rounded text-slate-11
    focus:border-transparent focus:bg-slate-5 focus:text-slate-12
  `,
)

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  (props, ref) => <StyledSelect ref={ref} {...props} />,
)
