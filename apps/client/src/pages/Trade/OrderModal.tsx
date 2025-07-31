import { apiRequest } from "@gikdev/react-datapi/src"
import {
  CheckSquareIcon,
  CloudXIcon,
  HandPalmIcon,
  PackageIcon,
  QuestionIcon,
  ReceiptIcon,
} from "@phosphor-icons/react"
import type { OrderFm } from "@repo/api-client/client"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { Btn, LoadingSpinner, Modal, useDrawerSheetNumber } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import { useIntegerQueryState } from "@repo/shared/hooks"
import { atom, useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect } from "react"
import { Link } from "react-router"
import { connectionRefAtom, connectionStateAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import routes from "../routes"
import Countdown from "./Countdown"
import { QUERY_KEYS } from "./navigation"

export const OrderModalStates = [
  "agreed",
  "waiting",
  "no-answer",
  "disagreed",
  "error",
  "loading",
] as const
export type OrderModalState = (typeof OrderModalStates)[number]
export const orderModalStateAtom = atom<OrderModalState>("agreed")

const OrderStatus = {
  Draft: 1,
  Processing: 2,
  Accepted: 3,
  Rejected: 4,
} as const

export default function DeletePriceSourceModal() {
  const [state, setState] = useAtom(orderModalStateAtom)
  const [currentOrderId, setCurrentOrderId] = useDrawerSheetNumber(QUERY_KEYS.currentOrderId)
  const [autoMin] = useIntegerQueryState(QUERY_KEYS.autoMinutes, 0)
  const connection = useAtomValue(connectionRefAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const title = calcTitle(state)
  const isOpen = typeof currentOrderId === "number"

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    connection?.on("Decided", onDecided)

    return () => connection?.off("Decided")
  }, [connection, connectionState, currentOrderId])

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    setState(autoMin <= 0 ? "no-answer" : "waiting")
  }, [autoMin])

  const onTimerEnd = useCallback(async () => {
    apiRequest<OrderFm>({
      config: genDatApiConfig(),
      options: {
        url: `/Customer/GetOrderByID/${currentOrderId}`,
        onSuccess(data) {
          const isAccepted = data?.orderStatus === OrderStatus.Accepted
          const isRejected = data?.orderStatus === OrderStatus.Rejected

          connection?.invoke("UpdateOrder", storageManager.get("ttkk", "sessionStorage"), data.id)

          if (isAccepted) setState("agreed")
          else if (isRejected) setState("disagreed")
          else setState("no-answer")
        },
        onError(err) {
          notifManager.notify(String(err || "unknown error"), "console", { status: "error" })
          setState("error")
        },
      },
    })
  }, [currentOrderId, connection, setState])

  useEffect(() => {
    const timeout = setTimeout(onTimerEnd, autoMin * 60 * 1000)
    return () => clearTimeout(timeout)
  }, [autoMin, onTimerEnd])

  const onDecided = (isAccepted: boolean, orderId: number) => {
    if (Number(currentOrderId) !== Number(orderId)) return
    setState(isAccepted ? "agreed" : "disagreed")
  }

  function handleClose() {
    if (state === "waiting" || state === "loading") return
    setCurrentOrderId(null)
  }

  const btns = (
    <>
      {state === "no-answer" && (
        <Btn className="col-span-2" as={Link} to={routes.orders} theme="primary" themeType="filled">
          <ReceiptIcon size={20} />
          <span>همه سفارشات</span>
        </Btn>
      )}

      {(state === "agreed" || state === "disagreed" || state === "error") && (
        <>
          <Btn as={Link} to={routes.products}>
            <PackageIcon size={20} />
            <span>محصولات</span>
          </Btn>

          <Btn as={Link} to={routes.orders}>
            <ReceiptIcon size={20} />
            <span>سفارشات</span>
          </Btn>
        </>
      )}
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="سفارش شما با موفقیت ثبت شد" btns={btns}>
      <div
        {...ccn("flex justify-between items-center", {
          "text-red-10": state === "disagreed" || state === "error",
          "text-green-10": state === "agreed",
        })}
      >
        <p>{title}</p>

        {state === "loading" && <LoadingSpinner size={48} />}

        {state === "waiting" && <Countdown minutes={autoMin <= 0 ? null : autoMin} />}

        {state === "agreed" && <CheckSquareIcon size={48} />}

        {state === "disagreed" && <HandPalmIcon size={48} />}

        {state === "no-answer" && <QuestionIcon size={48} />}

        {state === "error" && <CloudXIcon size={48} />}
      </div>
    </Modal>
  )
}

function calcTitle(state: OrderModalState) {
  switch (state) {
    case "agreed":
      return "سفارش شما تایید شد"

    case "waiting":
      return "متنظر پاسخ هستیم"

    case "no-answer":
      return "پاسخی نیامد"

    case "disagreed":
      return "سفارش شما رد شد"

    case "error":
      return "خطایی رخ داد"

    case "loading":
      return "درحال بارگذاری..."

    default:
      return "---"
  }
}
