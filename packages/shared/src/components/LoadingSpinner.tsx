import { type IconProps, SpinnerGapIcon } from "@phosphor-icons/react"
import { cn } from "#shared/helpers"

interface LoadingSpinnerProps extends IconProps {
  className?: string
}

export function LoadingSpinner({ className = "", ...other }: LoadingSpinnerProps) {
  return (
    <span className="text-inherit">
      <SpinnerGapIcon size={24} {...other} className={cn("animate-spin", className)} />
    </span>
  )
}
