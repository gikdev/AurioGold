import type { LabelHTMLAttributes, ReactNode } from "react"
import { WarningIcon } from "@phosphor-icons/react/Warning"

interface LabelerProps extends LabelHTMLAttributes<HTMLLabelElement> {
  labelText: ReactNode
  labelTextClassName?: string
  children: ReactNode
  errorMsg?: string
  hints?: ReactNode
}

export function Labeler({
  labelText,
  labelTextClassName,
  children,
  hints,
  errorMsg,
  ...others
}: LabelerProps) {
  return (
    <label className="flex flex-col gap-2" {...others}>
      <div className="flex gap-1 items-center">
        <span className={labelTextClassName}>{labelText}</span>
        <span className="me-auto" />
        <span>{errorMsg && <WarningIcon size={24} className="text-red-9" />}</span>
      </div>

      {children}

      {hints}

      {errorMsg && <p className="text-xs text-red-10 text-start">{errorMsg}</p>}
    </label>
  )
}
