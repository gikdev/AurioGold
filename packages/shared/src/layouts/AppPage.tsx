import { motion } from "motion/react"
import type { PropsWithChildren } from "react"
import { ErrorPageBoundary } from "#shared/components"
import { motionPresets } from "#shared/lib"

export default function AppPage({ children }: PropsWithChildren) {
  return (
    <ErrorPageBoundary>
      <motion.div {...motionPresets.slideUp}>{children}</motion.div>
    </ErrorPageBoundary>
  )
}
