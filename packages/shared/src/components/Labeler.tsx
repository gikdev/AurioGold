import type { LabelHTMLAttributes, ReactNode } from "react"

interface LabelerProps extends LabelHTMLAttributes<HTMLLabelElement> {
  labelPrimary: ReactNode
  labelPrimaryClassName?: string
  labelSecondary?: ReactNode
  children: ReactNode
  errorMsg?: string
}

export function Labeler({
  labelPrimary,
  labelPrimaryClassName,
  labelSecondary,
  children,
  errorMsg,
  ...others
}: LabelerProps) {
  return (
    <label className="flex flex-col gap-2" {...others}>
      <span className="flex justify-between items-center">
        <span className={labelPrimaryClassName}>{labelPrimary}</span>
        <span className="text-xs">{labelSecondary}</span>
      </span>
      {children}
      {errorMsg && <span className="text-xs text-reddark-10">{errorMsg}</span>}
    </label>
  )
}
