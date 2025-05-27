import type { IconProps } from "@phosphor-icons/react"
import { SpinnerGapIcon } from "@phosphor-icons/react/SpinnerGap"
import { styled } from "#shared/helpers"

interface LoadingSpinnerProps extends IconProps {
  className?: string
}

export function LoadingSpinner({ className = "", ...other }: LoadingSpinnerProps) {
  const StyledIcon = styled(SpinnerGapIcon, "animate-spin", className)

  return (
    <span className="text-inherit">
      <StyledIcon size={24} {...other} />
    </span>
  )
}
