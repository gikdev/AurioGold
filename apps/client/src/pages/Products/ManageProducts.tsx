import type { StockDto } from "@repo/api-client/client"
import {
  getApiTyStocksForCustommerOptions,
  getApiTyStocksForCustommerQueryKey,
} from "@repo/api-client/tanstack"
import { LoadingSpinner } from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { produce } from "immer"
import { useAtomValue } from "jotai"
import { useEffect } from "react"
import { connectionRefAtom } from "#/atoms"
import { getHeaderTokenOnly, queryClient } from "#/shared"
import { ProductCard } from "./ProductCard"
import ShowIfStoreOnline from "./ShowIfStoreOnline"

const useStocksQuery = () => useQuery(getApiTyStocksForCustommerOptions(getHeaderTokenOnly()))

export function ManageProducts() {
  useReceivePriceUpdate()
  const { data: products = [], status } = useStocksQuery()

  return (
    <ShowIfStoreOnline>
      <div className="flex flex-wrap gap-3 max-w-160 w-full mx-auto">
        {status === "success" && products.length === 0 && <p>هنوز محصولی نداریم...</p>}
        {status === "pending" && <LoadingSpinner className="block mx-auto" />}
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </ShowIfStoreOnline>
  )
}

function useReceivePriceUpdate() {
  const connection = useAtomValue(connectionRefAtom)

  useEffect(() => {
    connection?.on("ReceivePriceUpdate", applyStockUpdate)
    return () => connection?.off("ReceivePriceUpdate", applyStockUpdate)
  }, [connection])
}

function applyStockUpdate(
  productId: StockDto["id"],
  newPrice: number,
  priceType: "price" | "diffSellPrice" | "diffBuyPrice",
  date: string,
) {
  queryClient.setQueryData<StockDto[] | undefined>(
    getApiTyStocksForCustommerQueryKey(getHeaderTokenOnly()),
    oldData =>
      produce(oldData, draft => {
        if (!draft) return
        const stock = draft.find(p => p.id === productId)

        if (stock) {
          stock[priceType] = newPrice
          stock.dateUpdate = new Date(date).toISOString()
        }
      }),
  )
}
