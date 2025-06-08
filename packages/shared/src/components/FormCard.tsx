import styled from "@master/styled.react"
import type { Icon } from "@phosphor-icons/react"
import type { FormHTMLAttributes, ReactNode } from "react"

const StyledForm = styled.form`
  flex flex-col gap-8 bg-slate-2 border border-slate-6
  p-4 rounded-md max-w-[40rem] w-full mx-auto
`
const StyledHeading = styled.h2`
  text-2xl font-bold text-slate-12 flex items-center gap-1 justify-start
`

interface FormCardProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  title: string
  icon: Icon
  headingClassName?: string
  titleSlot?: ReactNode
}

export function FormCard({
  children,
  icon: Icon,
  title,
  headingClassName = "",
  titleSlot,
  ...other
}: FormCardProps) {
  return (
    <StyledForm {...other}>
      <StyledHeading className={headingClassName}>
        <Icon size={32} />
        <span>{title}</span>
        {titleSlot}
      </StyledHeading>

      {children}
    </StyledForm>
  )
}
