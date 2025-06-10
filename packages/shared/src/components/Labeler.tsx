import { WarningIcon } from "@phosphor-icons/react/Warning"
import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, memo } from "react"
import { cn } from "#shared/helpers"

interface LabelerCommonProps {
  labelText: ReactNode
  labelTextClassName?: string
  children: ReactNode
  errorMsg?: string
  hints?: ReactNode
  titleSlot?: ReactNode
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
  titleSlot,
  ...others
}: PolymorphicProps<T>) {
  const Tag = as || "label"
  return (
    <Tag className={cn("flex flex-col gap-2", className)} {...others}>
      <div className="flex gap-1 items-center">
        <span className={cn("", labelTextClassName)}>{labelText}</span>
        {titleSlot}
      </div>

      {children}

      {!!hints && hints}

      {errorMsg && (
        <p className="text-xs text-red-10 text-start">
          <WarningIcon size={16} className="inline m-1" />
          {errorMsg}
        </p>
      )}
    </Tag>
  )
}

export const Labeler = memo(_Labeler)
