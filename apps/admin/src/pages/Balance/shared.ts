import type { MasterPortfolioDto } from "@repo/api-client/client"
import { getApiMasterGetMasterPortfolioOptions } from "@repo/api-client/tanstack"
import { useQuery } from "@tanstack/react-query"
import { atom } from "jotai"
import { v4 as uuid } from "uuid"
import { getHeaderTokenOnly } from "#/shared/react-query"

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

export const useGetMasterPortfolioQuery = () =>
  useQuery({
    ...getApiMasterGetMasterPortfolioOptions(getHeaderTokenOnly()),
    select: rawItems => rawItems.map(mapSinglePortfolioItem),
  })
