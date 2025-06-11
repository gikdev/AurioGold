import { motionPresets } from "@repo/shared/lib"
import { AnimatePresence, motion } from "motion/react"
import { type ComponentProps, type ReactNode, useEffect } from "react"
import { useToggleLessOrMoreBtn } from "#shared/hooks"
import { TitledCard } from "./TitledCard"

type TitledCardProps = Omit<ComponentProps<typeof TitledCard>, "titleSlot">

interface TitledCardExpandableProps extends TitledCardProps {
  defaultOpen?: boolean
  btns?: ReactNode
  onOpenChange?: (newState: boolean) => void
}

export function TitledCardExpandable({
  title,
  icon: Icon,
  defaultOpen = false,
  btns,
  children,
  onOpenChange,
}: TitledCardExpandableProps) {
  const { ToggleLessOrMoreBtn, isOpen } = useToggleLessOrMoreBtn(defaultOpen)

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  const titleSlot = (
    <div className="ms-auto flex gap-2">
      {isOpen && btns}
      <ToggleLessOrMoreBtn />
    </div>
  )

  return (
    <TitledCard
      title={title}
      icon={Icon}
      titleSlot={titleSlot}
      headerClassName={isOpen ? "" : "border-0 pb-0"}
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div {...motionPresets.openCloseHeight} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TitledCard>
  )
}
