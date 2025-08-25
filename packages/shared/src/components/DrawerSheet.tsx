import { type Icon, XIcon } from "@phosphor-icons/react"
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs"
import { type ReactNode, useEffect } from "react"
import { Btn } from "#shared/components"
import { cn } from "#shared/helpers"
import { getIsMobile } from "#shared/hooks"

interface DrawerSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title: string
  icon: Icon
  actions?: ReactNode
  actionsClassName?: string
  btns?: ReactNode
  additionalBtns?: ReactNode
}

export function DrawerSheet({
  children,
  title,
  onClose,
  open,
  icon: IconToRender,
  actionsClassName = "",
  actions,
  btns,
  additionalBtns,
}: DrawerSheetProps) {
  const isMobile = getIsMobile()

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [onClose])

  return (
    open && (
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <button
          type="button"
          className="absolute inset-0 bg-black/80 backdrop-blur"
          onClick={onClose}
        />

        {/* Sheet/Drawer panel */}
        <div
          className={cn(
            "absolute bg-slate-1 flex flex-col shadow-lg",
            isMobile
              ? "left-0 right-0 bottom-0 rounded-t-md h-[90dvh]"
              : "top-0 left-0 h-full rounded-r-md w-[40vw] border-r border-slate-6",
          )}
        >
          {/* Header */}
          <div className="bg-slate-2 h-12 flex items-center px-2 rounded-t-md border-b border-slate-6">
            <div className="text-slate-12 flex items-center gap-1 me-auto [&_svg]:text-[1.5em]">
              <IconToRender />
              <span className="font-bold">{title}</span>
            </div>

            {additionalBtns}
            <Btn
              className="w-10 p-1 flex md:hidden bg-transparent hover:bg-slate-3 border-transparent"
              onClick={onClose}
            >
              <XIcon size={24} />
            </Btn>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-2">{children}</div>

          {actions && (
            <div className={cn("bg-slate-2 border-t border-slate-6", actionsClassName)}>
              {actions}
            </div>
          )}
          {btns && (
            <div className="bg-slate-2 border-t border-slate-6 grid grid-cols-2 p-2 gap-2">
              {btns}
            </div>
          )}
        </div>
      </div>
    )
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

export function useDrawerSheetString(id: string) {
  const [str, setStr] = useQueryState(id)

  return [str, setStr] as const
}
