import type { HubConnection } from "@microsoft/signalr"
import type { StockDtoForMaster } from "@repo/api-client"
import { getApiTyStocksQueryKey } from "@repo/api-client"
import { notifManager } from "@repo/shared/adapters"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import { useAtomValue } from "jotai"
import { connectionRefAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"

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

export function usePriceUpdater(product: StockDtoForMaster | undefined) {
  const queryClient = useQueryClient()
  const connection = useAtomValue(connectionRefAtom)
  const stocksKey = getApiTyStocksQueryKey()

  const mutation = useMutation({
    mutationFn: updatePrice,

    /**
     * Pessimistic update
     * - Wait for server success
     * - Then update cache
     */
    onSuccess: (_data, vars) => {
      queryClient.setQueryData<StockDtoForMaster[] | undefined>(stocksKey, old =>
        produce(old, draft => {
          if (!draft) return
          const stock = draft.find(s => s.id === vars.productId)
          if (stock) {
            stock[vars.priceType] = vars.newPrice
            stock.dateUpdate = new Date().toISOString()
          }
        }),
      )
    },

    onError: err => {
      notifManager.notify(`یه مشکلی پیش آمد (E-BIO9465): ${String(err)}`, "toast", {
        status: "error",
      })
    },
  })

  const change = (field: "price" | "diffBuyPrice" | "diffSellPrice", dir: "inc" | "dec") => {
    if (!product || product.id == null) return

    const isBase = field === "price"
    const step = isBase ? (product.priceStep ?? 0) : (product.diffPriceStep ?? 0)
    const current = (product as Record<typeof field, number | undefined>)[field] ?? 0
    const newPrice = dir === "inc" ? current + step : current - step

    mutation.mutate({
      connection,
      productId: product.id,
      newPrice,
      priceType: field,
    })
  }

  return {
    change,
    isPending: mutation.isPending,
    areAllBtnsEnabled: !!connection && !!product && !mutation.isPending,
  }
}
