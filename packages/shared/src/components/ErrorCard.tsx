import styled from "@master/styled.react"
import type { PropsWithChildren, ReactNode } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Heading, Hr } from "#shared/components"

const StyledContainer = styled.span`
  bg-red-2 border-2 border-red-6 p-4 flex flex-col
  gap-4 text-red-11 rounded-lg max-w-72 text-center
`

function ErrorCard() {
  return (
    <StyledContainer>
      <Heading as="h2" size={2}>
        خطا!
      </Heading>
      <Hr className="bg-red-6" />
      <p>یه مشکلی پیش اومده و به احتمال زیاد تقصیر ماست. میتوانید به مسئول مربوطه پیام دهید.</p>
    </StyledContainer>
  )
}

interface ErrorPageProps {
  title?: string
  description?: string
  children?: ReactNode
}

function ErrorPageInternal() {
  return (
    <div className="p-5 bg-red-1 flex-1 flex items-center justify-center">
      <div className="bg-red-3 border border-red-7 p-4 flex flex-col gap-4 text-red-11 rounded-lg max-w-72 text-center">
        <Heading as="h2" size={2} className="text-red-12">
          خطا!
        </Heading>

        <Hr className="bg-red-6 rounded-full" />

        <p>یه مشکلی پیش اومده و به احتمال زیاد تقصیر ماست. میتوانید به مسئول مربوطه پیام دهید.</p>
      </div>
    </div>
  )
}
export function ErrorPage({
  title = "خطا!",
  description = "یه مشکلی پیش اومده و به احتمال زیاد تقصیر ماست. میتوانید به مسئول مربوطه پیام دهید.",
  children,
}: ErrorPageProps) {
  return (
    <div className="p-5 bg-red-1 flex-1 flex items-center justify-center">
      <div className="bg-red-3 border border-red-7 p-4 flex flex-col gap-4 text-red-11 rounded-lg max-w-72 text-center">
        <Heading as="h2" size={2} className="text-red-12">
          {title}
        </Heading>

        <Hr className="bg-red-6 rounded-full" />

        <p>{description}</p>

        {children}
      </div>
    </div>
  )
}

export function ErrorCardBoundary({ children }: PropsWithChildren) {
  return <ErrorBoundary FallbackComponent={ErrorCard}>{children}</ErrorBoundary>
}

export function ErrorPageBoundary({ children }: PropsWithChildren) {
  return <ErrorBoundary FallbackComponent={ErrorPageInternal}>{children}</ErrorBoundary>
}
