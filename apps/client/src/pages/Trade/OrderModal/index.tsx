import { CheckSquareIcon, CloudXIcon, HandPalmIcon, QuestionIcon } from "@phosphor-icons/react"
import { LoadingSpinner, Modal, useDrawerSheetNumber } from "@repo/shared/components"
import { useIntegerQueryState } from "@repo/shared/hooks"
import { useAtom } from "jotai"
import { useCallback } from "react"
import { cx } from "#/shared/cva.config"
import { QUERY_KEYS } from "../navigation"
import { Btns } from "./Btns"
import { Countdown } from "./Countdown"
import { calcTitle, orderModalStateAtom } from "./stuff"
import { useHandleServerDecision } from "./useHandleServerDecision"
import { useOrderTimer } from "./useOrderTimer"

function useShouldBeOpen() {
  const [currentOrderId] = useDrawerSheetNumber(QUERY_KEYS.currentOrderId)
  return typeof currentOrderId === "number"
}

export function OrderModal() {
  const [modalState] = useAtom(orderModalStateAtom)
  const [, setCurrentOrderId] = useDrawerSheetNumber(QUERY_KEYS.currentOrderId)
  const [autoMin] = useIntegerQueryState(QUERY_KEYS.autoMinutes, 0)
  const title = calcTitle(modalState)

  useHandleServerDecision()
  useOrderTimer()

  const handleClose = useCallback(() => {
    if (modalState === "waiting" || modalState === "loading") return
    setCurrentOrderId(null)
  }, [modalState, setCurrentOrderId])

  const contentContainerStyles = cx("flex justify-between items-center", {
    "text-red-10": modalState === "disagreed" || modalState === "error",
    "text-green-10": modalState === "agreed",
  })

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title="سفارش شما با موفقیت ثبت شد"
      btns={<Btns modalState={modalState} />}
    >
      <div className={contentContainerStyles}>
        <p>{title}</p>

        {modalState === "waiting" && <Countdown minutes={autoMin <= 0 ? null : autoMin} />}
        {modalState === "loading" && <LoadingSpinner size={48} />}
        {modalState === "agreed" && <CheckSquareIcon size={48} />}
        {modalState === "disagreed" && <HandPalmIcon size={48} />}
        {modalState === "no-answer" && <QuestionIcon size={48} />}
        {modalState === "error" && <CloudXIcon size={48} />}
      </div>
    </Modal>
  )
}
OrderModal.useShouldBeOpen = useShouldBeOpen
