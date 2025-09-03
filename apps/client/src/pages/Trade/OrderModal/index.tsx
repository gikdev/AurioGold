import { CheckSquareIcon, CloudXIcon, HandPalmIcon, QuestionIcon } from "@phosphor-icons/react"
import { LoadingSpinner, Modal } from "@repo/shared/components"
import { useAtom } from "jotai"
import { cx } from "#/shared/cva.config"
import { Btns } from "./Btns"
import { Countdown } from "./Countdown"
import { useOrderModalStore } from "./store"
import { calcTitle, orderModalStateAtom } from "./stuff"
import { useHandleServerDecision } from "./useHandleServerDecision"
import { useOrderTimer } from "./useOrderTimer"

export function OrderModal() {
  const [modalState] = useAtom(orderModalStateAtom)
  const autoMinutes = useOrderModalStore(s => s.autoMinutes)

  const title = calcTitle(modalState)

  useOrderTimer()
  useHandleServerDecision()

  const handleClose = () => useOrderModalStore.getState().close()

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

        {modalState === "waiting" && <Countdown minutes={autoMinutes <= 0 ? null : autoMinutes} />}
        {modalState === "loading" && <LoadingSpinner size={48} />}
        {modalState === "agreed" && <CheckSquareIcon size={48} />}
        {modalState === "disagreed" && <HandPalmIcon size={48} />}
        {modalState === "no-answer" && <QuestionIcon size={48} />}
        {modalState === "error" && <CloudXIcon size={48} />}
      </div>
    </Modal>
  )
}
