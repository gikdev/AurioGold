import type { HubConnection } from "@microsoft/signalr"
import type { StockDtoForMaster } from "@repo/api-client/client"
import { getApiTyStocksQueryKey } from "@repo/api-client/tanstack"
import { notifManager } from "@repo/shared/adapters"
import { formatPersianPrice } from "@repo/shared/utils"
import { useMutation } from "@tanstack/react-query"
import { produce } from "immer"
import { useAtomValue } from "jotai"
import { useCallback } from "react"
import { connectionRefAtom } from "#/atoms"
import { useStocksQuery } from "#/pages/Products/shared"
import { queryClient } from "#/shared"
import genDatApiConfig from "#/shared/datapi-config"
import { PriceController } from "./PriceController"
import { PriceHr } from "./PriceHr"

async function updatePrice(opts: {
  connection: HubConnection | null
  productId: NonNullable<StockDtoForMaster["id"]>
  newPrice: number
  priceType: "price" | "diffBuyPrice" | "diffSellPrice"
}) {
  const { connection, productId, newPrice, priceType } = opts

  if (!connection || typeof connection.invoke !== "function") {
    throw new Error("No connection")
  }

  const adminToken = genDatApiConfig().token
  return connection.invoke("UpdatePrice", adminToken, productId, newPrice, priceType)
}

interface PriceControllersContainerProps {
  id: StockDtoForMaster["id"]
  price: StockDtoForMaster["price"]
  diffBuyPrice: StockDtoForMaster["diffBuyPrice"]
  diffSellPrice: StockDtoForMaster["diffSellPrice"]
}

export function PriceControllersContainer({
  diffBuyPrice,
  diffSellPrice,
  price,
  id,
}: PriceControllersContainerProps) {
  const connection = useAtomValue(connectionRefAtom)
  const { data: stocks = [] } = useStocksQuery()
  const product = stocks.find(p => p.id === id)

  const stocksKey = getApiTyStocksQueryKey()

  const updatePriceMutation = useMutation({
    mutationFn: updatePrice,

    /**
     * Optimistic Update
     * - Cancel ongoing queries to prevent overwriting the change
     * - Save previous state so it can be restored on error
     * - Apply changes in cache immediately for instant UI feedback
     */
    onMutate: async vars => {
      await queryClient.cancelQueries({ queryKey: stocksKey })

      const prev = queryClient.getQueryData<StockDtoForMaster[] | undefined>(stocksKey)

      queryClient.setQueryData<StockDtoForMaster[] | undefined>(stocksKey, old =>
        produce(old, draft => {
          if (!draft) return

          const stock = draft.find(product => product.id === vars.productId)

          if (stock) {
            stock[vars.priceType] = vars.newPrice
            stock.dateUpdate = new Date().toISOString()
          }
        }),
      )

      return { prev }
    },

    /**
     * Rollback on error
     * - Restore the previous cache state if the mutation fails
     * - Show an error notification
     */
    onError: (err, _vars, ctx) => {
      console.log("errored... rolling back...")
      if (ctx?.prev) queryClient.setQueryData(stocksKey, ctx.prev)

      notifManager.notify(`یه مشکلی پیش آمد (E-BIO9465): ${String(err)}`, "toast", {
        status: "error",
      })
    },
  })

  const areAllBtnsEnabled = !!connection && !!product && !updatePriceMutation.isPending

  /**
   * Change handler
   * - Calculates new price based on step values
   * - Supports both increment and decrement actions
   */
  const change = useCallback(
    (field: "price" | "diffBuyPrice" | "diffSellPrice", dir: "inc" | "dec") => {
      if (!product || id == null) return

      const isBase = field === "price"
      const step = isBase ? (product.priceStep ?? 0) : (product.diffPriceStep ?? 0)
      const current = (product as Record<typeof field, number | undefined>)[field] ?? 0
      const newPrice = dir === "inc" ? current + step : current - step

      updatePriceMutation.mutate({
        connection,
        productId: id,
        newPrice,
        priceType: field,
      })
    },
    [connection, updatePriceMutation, product, id],
  )

  return (
    <div className="flex flex-col items-center gap-2 p-2 xl:flex-row xl:gap-4">
      <PriceController
        onUpBtnClick={() => change("price", "inc")}
        onDownBtnClick={() => change("price", "dec")}
        areAllBtnsEnabled={areAllBtnsEnabled}
        price={formatPersianPrice(price ?? 0)}
        priceNumberColor="text-slate-12"
        title="قیمت (ریال)"
      />

      <PriceHr hasVertical />

      <PriceController
        onUpBtnClick={() => change("diffSellPrice", "inc")}
        onDownBtnClick={() => change("diffSellPrice", "dec")}
        areAllBtnsEnabled={areAllBtnsEnabled}
        price={formatPersianPrice(diffSellPrice ?? 0)}
        priceNumberColor="text-red-11"
        title="اختلاف فروش"
      />

      <PriceHr hasVertical />

      <PriceController
        onUpBtnClick={() => change("diffBuyPrice", "inc")}
        onDownBtnClick={() => change("diffBuyPrice", "dec")}
        areAllBtnsEnabled={areAllBtnsEnabled}
        price={formatPersianPrice(diffBuyPrice ?? 0)}
        priceNumberColor="text-green-11"
        title="اختلاف خرید"
      />
    </div>
  )
}
