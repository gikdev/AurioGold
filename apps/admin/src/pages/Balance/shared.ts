import type { MasterPortfolioDto } from "@repo/api-client/client"
import { getApiMasterGetMasterPortfolioOptions } from "@repo/api-client/tanstack"
import { useQuery } from "@tanstack/react-query"
import { atom } from "jotai"
import { v4 as uuid } from "uuid"
import genDatApiConfig from "#/shared/datapi-config"

export const selectedPortfolioIdAtom = atom<MasterPortfolioWithId["id"]>()

export interface MasterPortfolioWithId {
  id: string
  tyStockID: number
  stockName: string
  volume: number
}

function mapSinglePortfolioItem(item: MasterPortfolioDto): MasterPortfolioWithId {
  return {
    id: uuid(),
    stockName: item.stockName ?? "---",
    tyStockID: item.tyStockID ?? 0,
    volume: item.volume ?? 0,
  }
}

const getBearer = () => ({
  Authorization: `Bearer ${genDatApiConfig().token}`,
})

const getHeaderTokenOnly = () => ({
  headers: { ...getBearer() },
})

export const useGetMasterPortfolioQuery = () =>
  useQuery({
    ...getApiMasterGetMasterPortfolioOptions({
      ...getHeaderTokenOnly(),
    }),
    select: rawItems => rawItems.map(mapSinglePortfolioItem),
  })
