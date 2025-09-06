import type { StockDto } from "@repo/api-client"
import { getApiTyStocksForCustommerByIdQueryKey } from "@repo/api-client"
import { produce } from "immer"
import { useAtomValue } from "jotai"
import { useCallback, useEffect } from "react"
import { connectionRefAtom } from "#/atoms"
import { queryClient } from "#/shared"
import type { ProductId } from "../shared"
import { useProductId } from "./shared"

export function useHandlePriceUpdate() {
  const productId = useProductId()
  const connection = useAtomValue(connectionRefAtom)

  const handlePriceUpdate = useCallback(
    (
      id: ProductId,
      newPrice: number,
      priceType: "price" | "diffSellPrice" | "diffBuyPrice",
      date: string,
    ) => {
      if (typeof productId !== "number") return
      if (id !== productId) return

      const byIdQueryKey = getApiTyStocksForCustommerByIdQueryKey({
        path: { id: productId },
      })

      // update the single product
      queryClient.setQueryData<StockDto>(byIdQueryKey, old =>
        old
          ? produce(old, draft => {
              draft[priceType] = newPrice
              draft.dateUpdate = date
            })
          : old,
      )
    },
    [productId],
  )

  useEffect(() => {
    connection?.on("ReceivePriceUpdate", handlePriceUpdate)
    return () => connection?.off("ReceivePriceUpdate", handlePriceUpdate)
  }, [connection, handlePriceUpdate])
}
