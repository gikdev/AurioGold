import { type HTMLMotionProps, motion } from "motion/react"
import { ErrorPageBoundary } from "#shared/components"
import { motionPresets } from "#shared/lib"

export function AppPage({ children, ...others }: HTMLMotionProps<"div">) {
  return (
    <ErrorPageBoundary>
      <motion.div {...motionPresets.slideUp} {...others}>
        {children}
      </motion.div>
    </ErrorPageBoundary>
  )
}
