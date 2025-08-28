import type { ReactNode } from "react"

interface ContainerProps {
  title: string
  children: ReactNode
}

export function Container({ children, title }: ContainerProps) {
  return (
    <fieldset className="border border-slate-6 rounded-md p-4 flex flex-col gap-5">
      <legend className="px-2 -ms-2 text-slate-12 font-bold text-lg">{title}</legend>
      {children}
    </fieldset>
  )
}
