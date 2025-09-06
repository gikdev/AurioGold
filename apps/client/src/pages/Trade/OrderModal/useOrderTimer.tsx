import { apiRequest } from "@gikdev/react-datapi/src"
import type { OrderFm } from "@repo/api-client"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect } from "react"
import { connectionRefAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import { ProductAutoMode } from "../shared"
import { useOrderModalStore } from "./store"
import { OrderStatus, orderModalStateAtom } from "./stuff"

export function useOrderTimer() {
  const [, setModalState] = useAtom(orderModalStateAtom)
  const currentOrderId = useOrderModalStore(s => s.orderId)
  const autoMinutes = useOrderModalStore(s => s.autoMinutes)
  const mode = useOrderModalStore(s => s.mode)
  const connection = useAtomValue(connectionRefAtom)

  // Make sure user isn't waiting if he's not supposed to
  useEffect(() => {
    if (autoMinutes > 0) {
      setModalState("waiting")
      return
    }

    if (mode === ProductAutoMode.Normal) {
      return
    }

    if (mode === ProductAutoMode.AutoAccept) {
      setModalState("agreed")
      return
    }

    if (mode === ProductAutoMode.AutoReject) {
      setModalState("disagreed")
      return
    }

    setModalState("no-answer")
  }, [autoMinutes, setModalState, mode])

  // Check to see what's up with the status after the timer ended
  const fetchOrderStatus = useCallback(async () => {
    if (!currentOrderId) return

    try {
      const res = await apiRequest<OrderFm>({
        config: genDatApiConfig(),
        options: { url: `/Customer/GetOrderByID/${currentOrderId}` },
      })

      connection?.invoke(
        "UpdateOrder",
        storageManager.get("client_ttkk", "sessionStorage"),
        res.data?.id,
      )

      if (res.data?.orderStatus === OrderStatus.Accepted) setModalState("agreed")
      else if (res.data?.orderStatus === OrderStatus.Rejected) setModalState("disagreed")
      else setModalState("no-answer")
    } catch (err) {
      notifManager.notify(String(err || "unknown error"), "console", { status: "error" })
      setModalState("error")
    }
  }, [currentOrderId, connection, setModalState])

  // Timer logic
  useEffect(() => {
    if (autoMinutes <= 0) return
    const timeout = setTimeout(fetchOrderStatus, autoMinutes * 60 * 1000)
    return () => clearTimeout(timeout)
  }, [autoMinutes, fetchOrderStatus])
}
