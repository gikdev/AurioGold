import { useAtom, useAtomValue } from "jotai"
import { useCallback, useEffect } from "react"
import { connectionRefAtom } from "#/atoms"
import { useOrderModalStore } from "./store"
import { orderModalStateAtom } from "./stuff"

export function useHandleServerDecision() {
  const [, setModalState] = useAtom(orderModalStateAtom)
  const currentOrderId = useOrderModalStore(s => s.orderId)
  const connection = useAtomValue(connectionRefAtom)

  const onDecided = useCallback(
    (isAccepted: boolean, orderId: number) => {
      if (typeof currentOrderId !== "number") return
      if (Number(currentOrderId) !== Number(orderId)) return
      setModalState(isAccepted ? "agreed" : "disagreed")
    },
    [currentOrderId, setModalState],
  )

  useEffect(() => {
    connection?.on("Decided", onDecided)
    return () => connection?.off("Decided", onDecided)
  }, [connection, onDecided])
}
