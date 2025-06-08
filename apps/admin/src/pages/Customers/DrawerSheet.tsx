import { type Icon, XIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { cn } from "@repo/shared/helpers"
import { useIsMobile } from "@repo/shared/hooks"
import { AnimatePresence, motion } from "motion/react"
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs"
import type { ReactNode } from "react"

interface DrawerSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title: string
  icon: Icon
}

export function DrawerSheet({
  children,
  title,
  onClose,
  open,
  icon: IconToRender,
}: DrawerSheetProps) {
  const isMobile = useIsMobile()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet/Drawer panel */}
          <motion.div
            className={cn(
              "absolute bg-slate-1 flex flex-col shadow-lg",
              isMobile
                ? "left-0 right-0 bottom-0 rounded-t-md h-[90vh]"
                : "top-0 left-0 h-full rounded-r-md w-[40vw] border-r border-slate-6",
            )}
            initial={isMobile ? { y: "100%" } : { x: "-100%" }}
            animate={{ x: 0, y: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-slate-2 h-12 flex items-center px-2 rounded-t-md justify-between border-b border-slate-6">
              <div className="text-slate-12 flex items-center gap-1">
                <IconToRender size={24} />
                <span className="font-bold">{title}</span>
              </div>

              <Btn className="p-1 w-10 bg-transparent border-transparent" onClick={onClose}>
                <XIcon size={24} />
              </Btn>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useDrawerSheet(id: string) {
  const [isOpen, setOpen] = useQueryState(
    id,
    parseAsBoolean.withDefault(false).withOptions({ history: "push" }),
  )

  return [isOpen, setOpen] as const
}

export function useDrawerSheetNumber(id: string) {
  const [num, setNum] = useQueryState(id, parseAsInteger.withOptions({ history: "push" }))

  return [num, setNum] as const
}
