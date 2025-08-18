import type { StockDtoForMaster } from "@repo/api-client/client"
import { useCallback } from "react"
import { ChangeA11yModal } from "./ChangeA11yModal"
import { calcA11yStuff } from "./calcA11yStuff"

interface A11yBtnProps {
  productId: StockDtoForMaster["id"]
  status: StockDtoForMaster["status"]
}

export function A11yBtn({ status, productId }: A11yBtnProps) {
  const [isOpen, setOpen] = ChangeA11yModal.useModal()
  const { Icon, classes, name } = calcA11yStuff(status)

  const openModal = useCallback(() => setOpen(true), [setOpen])
  const closeModal = useCallback(() => setOpen(false), [setOpen])

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-1 p-2 hover:bg-slate-4 cursor-pointer"
        onClick={openModal}
      >
        <Icon size={16} className={classes} />
        <span>{name}</span>
      </button>

      {isOpen && typeof productId === "number" && (
        <ChangeA11yModal initialStatus={status} productId={productId} onClose={closeModal} />
      )}
    </>
  )
}
