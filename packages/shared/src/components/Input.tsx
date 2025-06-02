import { type InputHTMLAttributes, forwardRef } from "react"
import { styled } from "#shared/helpers"

const StyledInput = styled(
  "input",
  `
    px-4 py-3 bg-slate-3 border border-slate-7 rounded text-slate-11 w-full
    focus:border-transparent focus:bg-slate-5 focus:text-slate-12
  `,
)

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <StyledInput ref={ref} {...props} />,
)
