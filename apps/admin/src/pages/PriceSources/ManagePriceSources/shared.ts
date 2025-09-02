import type { StockPriceSourceResponse } from "@repo/api-client"
import { getApiStockPriceSourceGetStockPriceSourcesOptions } from "@repo/api-client"
import { create } from "zustand"

export type PriceSourceId = NonNullable<StockPriceSourceResponse["id"]>
export const priceSourcesOptions =
  getApiStockPriceSourceGetStockPriceSourcesOptions(
    // getHeaderTokenOnly("admin"),
  )

interface PriceSourcesStore {
  mode: "initial" | "create" | "edit" | "remove" | "details"
  sourceId: PriceSourceId | null

  close: () => void
  createNew: () => void
  edit: (sourceId: PriceSourceId) => void
  remove: (sourceId: PriceSourceId) => void
  details: (sourceId: PriceSourceId) => void

  reset: () => void
}

export const usePriceSourcesStore = create<PriceSourcesStore>()(set => ({
  mode: "initial",
  sourceId: null,

  close: () => set({ mode: "initial" }),
  createNew: () => set({ mode: "create" }),
  edit: sourceId => set({ mode: "edit", sourceId }),
  details: sourceId => set({ mode: "details", sourceId }),
  remove: sourceId => set({ mode: "remove", sourceId }),

  reset: () => set({ sourceId: null, mode: "initial" }),
}))
