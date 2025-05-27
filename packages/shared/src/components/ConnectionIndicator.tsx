import { GlobeIcon } from "@phosphor-icons/react/Globe"
import { GlobeXIcon } from "@phosphor-icons/react/GlobeX"
import { QuestionIcon } from "@phosphor-icons/react/Question"
import { styled } from "../helpers"

interface ConnectionIndicatorProps {
  connectionState: unknown // TODO
}

export function ConnectionIndicator({ connectionState }: ConnectionIndicatorProps) {
  const Icon = chooseIcon(connectionState)
  const StyledContainer = styled("div", "p-1 rounded-full bg-slate-4 text-slate-11", {
    "bg-jade-4 text-jade-11": connectionState === "connected",
    "bg-red-4 text-red-11": connectionState === "disconnected",
  })

  return (
    <StyledContainer>
      <Icon size={24} />
    </StyledContainer>
  )
}

// TODO
function chooseIcon(connectionState: unknown) {
  if (connectionState === "connected") return GlobeIcon
  if (connectionState === "disconnected") return GlobeXIcon
  return QuestionIcon
}
