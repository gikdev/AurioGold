import { ErrorCardBoundary, Heading, Hr } from "#shared/components"
import { styled } from "#shared/helpers"

interface HeadingLineProps {
  title: string
  className?: string
  children?: React.ReactNode
}

export function HeadingLine({ title, className = "", children = null }: HeadingLineProps) {
  const StyledSection = styled("section", "px-4 py-8 md:p-8", className)

  return (
    <>
      <Heading as="h1" size={5} className="text-slate-12 mb-4 mt-6 text-center">
        {title}
      </Heading>
      <Hr />
      <StyledSection>
        <ErrorCardBoundary>{children}</ErrorCardBoundary>
      </StyledSection>
    </>
  )
}
