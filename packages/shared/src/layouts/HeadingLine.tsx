import styled from "@master/styled.react"
import { ErrorCardBoundary, Heading } from "#shared/components"

interface HeadingLineProps {
  title: string
  className?: string
  children?: React.ReactNode
}

export function HeadingLine({ title, className = "", children = null }: HeadingLineProps) {
  const StyledSection = styled.section("px-4 py-8 md:p-8", className)

  return (
    <>
      <Heading
        as="h1"
        size={4}
        className="text-slate-12 mb-6 mt-6 text-center border-b max-w-max mx-auto pb-6 border-slate-6"
      >
        {title}
      </Heading>
      <StyledSection>
        <ErrorCardBoundary>{children}</ErrorCardBoundary>
      </StyledSection>
    </>
  )
}
