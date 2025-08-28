import type { StockDtoForMaster } from "@repo/api-client/client"
import { getApiTyStocksOptions, getApiTyStocksQueryKey } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { useQuery } from "@tanstack/react-query"
import { produce } from "immer"
import { queryClient } from "#/shared"

function toClock(n: number, unit: "h" | "m" | "s") {
  if (unit === "h") return n * 60 * 60 * 1000
  if (unit === "m") return n * 60 * 1000
  if (unit === "s") return n * 1000
  return n
}

export const useStocksQuery = () =>
  useQuery({
    ...getApiTyStocksOptions(getHeaderTokenOnly()),
    staleTime: toClock(10, "s"),
    refetchInterval: toClock(1, "m"),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
  { id: "0", text: "گرمی", value: "0" },
  { id: "1", text: "تعدادی", value: "1" },
  { id: "2", text: "مثقالی", value: "2" },
]
export const TransactionMethod = {
  gram: "0",
  count: "1",
  mithqal: "2",
}
export type TransactionMethod = "0" | "1" | "2"

export const transactionTypes = [
  { id: "0", text: "عادی", value: "0" },
  { id: "1", text: "تایید خودکار", value: "1" },
  { id: "2", text: "رد خودکار", value: "2" },
]
export type TransactionType = "0" | "1" | "2"

export const transactionStatuses = [
  { id: "0", text: "غیر فعال", value: "0" },
  { id: "1", text: "قابل خرید توسط مشتری", value: "1" },
  { id: "2", text: "قابل فروش توسط مشتری", value: "2" },
  { id: "3", text: "قابل خرید و فروش", value: "3" },
]
export type TransactionStatus = "0" | "1" | "2" | "3"

export function toSafeNumber(input: string | null | undefined): number {
  if (!input) return 0
  const convertedInput = Number(input)
  if (Number.isNaN(convertedInput)) return 0
  return convertedInput
}
