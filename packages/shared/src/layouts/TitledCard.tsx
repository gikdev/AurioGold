import type { ElementType, HTMLAttributes, ReactNode } from "react"
import { styled } from "#/helpers"
import { Heading } from "../components"

interface TitledCardProps extends HTMLAttributes<HTMLElement> {
  title?: string
  children: ReactNode
  as?: ElementType
}

export function TitledCard({
  title = "",
  children,
  as: Tag = "section",
  ...other
}: TitledCardProps) {
  const StyledContainer = styled(
    Tag,
    "px-4 py-8 rounded-xl border-2 bg-slatedark-2 border-slatedark-6",
  )

  return (
    <StyledContainer {...other}>
      {title && (
        <Heading as="h1" size={3} className="text-slatedark-11 mb-4 text-center">
          {title}
        </Heading>
      )}
      {children}
    </StyledContainer>
  )
}
