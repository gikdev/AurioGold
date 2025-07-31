import { XIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { Btn } from "./Btn"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  btns?: ReactNode
  children?: ReactNode
}

export function Modal({ isOpen, onClose, title, description, btns, children }: ModalProps) {
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="bg-slate-1 text-slate-11 w-full sm:max-w-lg rounded-t-md sm:rounded-md shadow-xl p-4 sm:p-6 mx-auto gap-4 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-12">{title}</h2>

              <Btn onClick={onClose} className="w-10 p-1 bg-transparent border-transparent">
                <XIcon size={24} />
              </Btn>
            </div>

            {description && <div className="text-sm">{description}</div>}

            {children}

            <div className="flex gap-2 items-center flex-wrap *:flex-1">{btns}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
