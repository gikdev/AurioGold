import styled from "@master/styled.react"
import type { ReactNode } from "react"
import { ErrorCardBoundary, Heading } from "#shared/components"

interface HeadingLineProps {
  title: string
  className?: string
  children?: ReactNode
  actions?: ReactNode
}

export function HeadingLine({ title, actions, className = "", children = null }: HeadingLineProps) {
  const StyledSection = styled.section("p-4", className)

  return (
    <>
      {actions ? (
        <div className="flex items-center gap-2 border-b border-slate-6 p-2">
          <Heading as="h1" size={3} className="text-slate-12">
            {title}
          </Heading>

          {actions}
        </div>
      ) : (
        <Heading
          as="h1"
          size={3}
          className="text-slate-12 mb-0 mt-6 text-center border-b max-w-max mx-auto pb-6 border-slate-6"
        >
          {title}
        </Heading>
      )}

      <ErrorCardBoundary>
        {actions ? children : <StyledSection>{children}</StyledSection>}
      </ErrorCardBoundary>
    </>
  )
}
