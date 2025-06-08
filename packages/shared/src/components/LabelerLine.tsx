import { WarningIcon } from "@phosphor-icons/react/Warning"
import type { ReactNode } from "react"
import { cn } from "#shared/helpers"

interface LabelerLineProps {
  labelText: ReactNode
  labelTextClassName?: string
  children: ReactNode
  className?: string
  errorMsg?: string
  hints?: ReactNode
  titleSlot?: ReactNode
}

export function LabelerLine({
  labelText,
  labelTextClassName,
  children,
  hints,
  errorMsg,
  className,
  titleSlot,
  ...others
}: LabelerLineProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)} {...others}>
      <div className="flex gap-1 items-center justify-between">
        <span className={cn("text-slate-12 font-bold", labelTextClassName)}>{labelText}</span>
        {children}
      </div>

      {!!hints && hints}

      {errorMsg && (
        <p className="text-xs text-red-10 text-start">
          <WarningIcon size={16} className="inline m-1" />
          {errorMsg}
        </p>
      )}
    </label>
  )
}
