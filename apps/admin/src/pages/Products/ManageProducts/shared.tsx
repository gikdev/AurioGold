import type { StockDtoForMaster } from "@repo/api-client/client"
import { getApiTyStocksOptions, getApiTyStocksQueryKey } from "@repo/api-client/tanstack"
import { useQuery } from "@tanstack/react-query"
import { produce } from "immer"
import { queryClient } from "#/shared"
import { getHeaderTokenOnly } from "#/shared/forms"

export const useStocksQuery = () =>
  useQuery({
    ...getApiTyStocksOptions(getHeaderTokenOnly()),
  })

export function refetchStocks() {
  queryClient.refetchQueries({ queryKey: getApiTyStocksQueryKey(getHeaderTokenOnly()) })
}

export function applyStockUpdate(
  productId: NonNullable<StockDtoForMaster["id"]>,
  newPrice: number,
  priceType: "price" | "diffSellPrice" | "diffBuyPrice",
  date: string,
) {
  queryClient.setQueryData<StockDtoForMaster[] | undefined>(
    getApiTyStocksQueryKey(getHeaderTokenOnly()),
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

export const transactionMethods = [
  { id: "0", name: "گرمی" },
  { id: "1", name: "تعدادی" },
  { id: "2", name: "مثقالی" },
]
export const TransactionMethod = {
  gram: "0",
  count: "1",
  mithqal: "2",
}
export type TransactionMethod = "0" | "1" | "2"

export const transactionTypes = [
  { id: "0", name: "عادی" },
  { id: "1", name: "تایید خودکار" },
  { id: "2", name: "رد خودکار" },
]
export type TransactionType = "0" | "1" | "2"

export const transactionStatuses = [
  { id: "0", name: "غیر فعال" },
  { id: "1", name: "قابل خرید توسط مشتری" },
  { id: "2", name: "قابل فروش توسط مشتری" },
  { id: "3", name: "قابل خرید و فروش" },
]
export type TransactionStatus = "0" | "1" | "2" | "3"

export function toSafeNumber(input: string | null | undefined): number {
  if (!input) return 0
  const convertedInput = Number(input)
  if (Number.isNaN(convertedInput)) return 0
  return convertedInput
}
