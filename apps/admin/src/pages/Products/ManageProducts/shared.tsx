import type { StockDtoForMaster } from "@repo/api-client/client"
import { getApiTyStocksOptions, getApiTyStocksQueryKey } from "@repo/api-client/tanstack"
import { useQuery } from "@tanstack/react-query"
import { produce } from "immer"
import { queryClient } from "#/shared"
import genDatApiConfig from "#/shared/datapi-config"

const getBearer = () => ({
  Authorization: `Bearer ${genDatApiConfig().token}`,
})

export const getHeaderTokenOnly = () => ({
  headers: { ...getBearer() },
})

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

interface Field {
  state: {
    meta: {
      isValid: boolean
      errors?: Array<{ message?: string } | undefined>
    }
  }
}

export const extractError = (field: Field) =>
  field.state.meta.isValid ? undefined : field.state.meta.errors?.map(e => e?.message)?.join("، ")
