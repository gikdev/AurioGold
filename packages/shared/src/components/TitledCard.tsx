import type { Icon } from "@phosphor-icons/react"
import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "#shared/helpers"
import { cx } from "#shared/lib/cva.config"
import { Heading } from "./Heading"

const containerStyles = cx(`
  flex flex-col gap-8 bg-slate-2 border border-slate-6
  p-4 rounded-md max-w-160 w-full mx-auto
`)

const headerStyles = cx(`
  flex flex-wrap gap-1 justify-start
  border-b border-slate-6 pb-4
`)

interface TitledCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  title: string
  icon: Icon
  headerClassName?: string
  titleSlot?: ReactNode
}

export function TitledCard({
  children,
  icon: Icon,
  title,
  headerClassName = "",
  titleSlot,
  className,
  ...other
}: TitledCardProps) {
  return (
    <div className={cn(containerStyles, className)} {...other}>
      <div className={cn(headerStyles, headerClassName)}>
        <div className="flex items-center gap-1">
          <Icon size={24} />
          <Heading size={1}>{title}</Heading>
        </div>

        {titleSlot}
      </div>

      {children}
    </div>
  )
}
