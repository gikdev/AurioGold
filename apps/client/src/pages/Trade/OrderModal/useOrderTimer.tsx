import { apiRequest } from "@gikdev/react-datapi/src"
import type { OrderFm } from "@repo/api-client"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { useDrawerSheetNumber } from "@repo/shared/components"
import { useIntegerQueryState } from "@repo/shared/hooks"
import { useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect } from "react"
import { connectionRefAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import { QUERY_KEYS } from "../navigation"
import { OrderStatus, orderModalStateAtom } from "./stuff"

export function useOrderTimer() {
  const [, setModalState] = useAtom(orderModalStateAtom)
  const [currentOrderId] = useDrawerSheetNumber(QUERY_KEYS.currentOrderId)
  const [autoMin] = useIntegerQueryState(QUERY_KEYS.autoMinutes, 0)
  const connection = useAtomValue(connectionRefAtom)

  // Make sure user isn't waiting if he's not supposed to
  useEffect(() => {
    setModalState(autoMin <= 0 ? "no-answer" : "waiting")
  }, [autoMin, setModalState])

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
    if (autoMin <= 0) return
    const timeout = setTimeout(fetchOrderStatus, autoMin * 60 * 1000)
    return () => clearTimeout(timeout)
  }, [autoMin, fetchOrderStatus])
}
