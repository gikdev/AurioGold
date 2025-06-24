// @ts-nocheck
import { Btn, Hr, LoadingSpinner } from "@/components"
import { MESSAGES } from "@/constants"
import { CheckSquareOffset, CloudX, HandPalm, Question, X } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { Link } from "wouter"
import { persianizeSeconds } from "./persianify-seconds.util"

export const OrderModalState = {
  Agreed: "agreed",
  Waiting: "waiting",
  NoAnswer: "no answer",
  Disagreed: "disagreed",
  Error: "error",
}

export function OrderModal({ state, modal, seconds }) {
  const { Modal, closeModal } = modal
  const [sec, setSec] = useState(seconds)

  const dialogClassName =
    "fixed inset-0 z-10 w-full h-full bg-slatedark-2/95 flex items-center justify-center"
  const dialogContentContainerClassName =
    "flex w-full max-w-96 text-slatedark-11 bg-slatedark-2 flex-col p-4 gap-4 rounded-lg border-2 border-slatedark-6"

  function handleCloseBtn() {
    if (state === OrderModalState.Waiting) return
    closeModal()
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSec(seconds)
  }, [modal])

  useEffect(() => {
    if (state === OrderModalState.Waiting) {
      if (sec === 0) return
      setTimeout(() => {
        setSec(sec - 1)
      }, 1000)
    }
  }, [sec, state])

  return (
    <Modal
      dialogProps={{ className: dialogClassName }}
      dialogContentContainerProps={{
        className: dialogContentContainerClassName,
      }}
    >
      <header className="flex gap-2 justify-between items-center">
        <p className="font-bold text-xl text-start">درخواست سفارش ارسال شد</p>
        <Btn
          className="p-0 w-10"
          disabled={state === OrderModalState.Waiting}
          onClick={handleCloseBtn}
        >
          <X size={24} />
        </Btn>
      </header>
      <Hr />

      {state === OrderModalState.Waiting && (
        <div className="flex gap-2 justify-center items-center">
          <p className="text-5xl font-black">{persianizeSeconds(sec)}</p>
          <LoadingSpinner size={48} />
        </div>
      )}
      {state === OrderModalState.Waiting && (
        <p className="text-center">منتظر پاسخ فروشنده هستیم.</p>
      )}

      {state === OrderModalState.Agreed && (
        <div className="text-jadedark-10 mx-auto">
          <CheckSquareOffset size={72} />
        </div>
      )}
      {state === OrderModalState.Agreed && (
        <p className="text-center text-jadedark-10">درخواست سفارش شما توسط ادمین تایید شد!</p>
      )}

      {state === OrderModalState.Disagreed && (
        <div className="text-reddark-10 mx-auto">
          <HandPalm size={72} />
        </div>
      )}
      {state === OrderModalState.Disagreed && (
        <p className="text-center text-reddark-10">درخواست سفارش شما توسط ادمین رد شد!</p>
      )}

      {state === OrderModalState.NoAnswer && (
        <div className="text-slatedark-11 mx-auto">
          <Question size={72} />
        </div>
      )}
      {state === OrderModalState.NoAnswer && (
        <p className="text-center">
          فروشنده پاسخی نداد. لطفا با مراجعه به{" "}
          <Link className="underline text-amberdark-9" href="/orders">
            قسمت سفارش‌ها
          </Link>{" "}
          از وضعیت سفارش خود مطلع شوید
        </p>
      )}

      {state === OrderModalState.Error && (
        <div className="text-reddark-10 mx-auto">
          <CloudX size={72} />
        </div>
      )}
      {state === OrderModalState.Error && (
        <p className="text-center text-reddark-10">{MESSAGES.ERROR_DEFAULT_DESCRIPTION}</p>
      )}
    </Modal>
  )
}
