import styled from "@master/styled.react"
import type { ReactNode } from "react"
import { Heading } from "#shared/components"
import { AppPage } from "#shared/layouts"

interface HeadingLineProps {
  title: string
  className?: string
  children?: ReactNode
  actions?: ReactNode
  containerClassName?: string
}

export function HeadingLine({
  title,
  actions,
  className = "",
  children = null,
  containerClassName = "",
}: HeadingLineProps) {
  const StyledSection = styled.section("p-4", className)

  return (
    <AppPage className={containerClassName}>
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
          className="text-slate-12 mb-0 mt-6 text-center border-b max-w-max mx-auto pb-2 border-slate-6"
        >
          {title}
        </Heading>
      )}

      {actions ? children : <StyledSection>{children}</StyledSection>}
    </AppPage>
  )
}
