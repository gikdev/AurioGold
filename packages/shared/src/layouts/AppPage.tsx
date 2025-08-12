import type { ComponentProps } from "react"
import { ErrorPageBoundary } from "#shared/components"

export function AppPage({ children, ...others }: ComponentProps<"div">) {
  return (
    <ErrorPageBoundary>
      <div {...others}>{children}</div>
    </ErrorPageBoundary>
  )
}
