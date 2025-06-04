import type { ElementType, HTMLAttributes, ReactNode } from "react"
import { Heading } from "#shared/components"

interface TitledCardProps extends HTMLAttributes<HTMLElement> {
  title?: string
  children: ReactNode
  as?: ElementType
}

export function TitledCard({
  title = "",
  children,
  as: Tag = "section",
  ...other
}: TitledCardProps) {
  return (
    <Tag {...other} className="px-4 py-8 rounded-xl border-2 bg-slate-2 border-slate-6">
      {title && (
        <Heading as="h1" size={3} className="text-slate-11 mb-4 text-center">
          {title}
        </Heading>
      )}
      {children}
    </Tag>
  )
}
