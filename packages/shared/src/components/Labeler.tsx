import { WarningIcon } from "@phosphor-icons/react/Warning"
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { cn } from "#shared/helpers"

interface LabelerCommonProps {
  labelText: ReactNode
  labelTextClassName?: string
  children: ReactNode
  errorMsg?: string
  hints?: ReactNode
}

type PolymorphicProps<T extends ElementType> = {
  as?: T
} & LabelerCommonProps &
  ComponentPropsWithoutRef<T>

export function Labeler<T extends ElementType = "label">({
  labelText,
  labelTextClassName,
  children,
  hints,
  as,
  errorMsg,
  ...others
}: PolymorphicProps<T>) {
  const Tag = as || "label"
  return (
    <Tag className="flex flex-col gap-2" {...others}>
      <div className="flex gap-1 items-center">
        <span className={cn("text-slate-12 font-bold", labelTextClassName)}>{labelText}</span>
        <span className="me-auto" />
        {errorMsg && <WarningIcon size={20} className="text-red-9" />}
      </div>

      {children}

      {!!hints && hints}

      {errorMsg && <p className="text-xs text-red-10 text-start">{errorMsg}</p>}
    </Tag>
  )
}
