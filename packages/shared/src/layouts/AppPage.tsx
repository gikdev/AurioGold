import { ErrorPageBoundary } from "@repo/shared/components"
import { motionPresets } from "@repo/shared/lib"
import { motion } from "motion/react"
import type { PropsWithChildren } from "react"

export default function AppPage({ children }: PropsWithChildren) {
  return (
    <ErrorPageBoundary>
      <motion.div {...motionPresets.slideUp}>{children}</motion.div>
    </ErrorPageBoundary>
  )
}
