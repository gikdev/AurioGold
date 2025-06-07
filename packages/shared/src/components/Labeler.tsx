import { WarningIcon } from "@phosphor-icons/react/Warning"
import { memo, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react"
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

function _Labeler<T extends ElementType = "label">({
  labelText,
  labelTextClassName,
  children,
  hints,
  as,
  errorMsg,
  className,
  ...others
}: PolymorphicProps<T>) {
  const Tag = as || "label"
  return (
    <Tag className={cn("flex flex-col gap-2", className)} {...others}>
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

export const Labeler = memo(_Labeler)
