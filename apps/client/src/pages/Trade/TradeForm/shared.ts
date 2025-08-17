import type { StockStatus } from "@repo/api-client/client"
import { getApiTyStocksForCustommerByIdOptions } from "@repo/api-client/tanstack"
import { useLiteralQueryState, useNullableIntegerQueryState } from "@repo/shared/hooks"
import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { create } from "zustand"
import { connectionStateAtom, profileAtom } from "#/atoms"
import { getHeaderTokenOnly } from "#/shared"
import { QUERY_KEYS } from "../navigation"

export const sides = ["buy", "sell"] as const
export type Side = (typeof sides)[number]
export const useProductSide = () => useLiteralQueryState(QUERY_KEYS.side, sides)

// const minutes = (n: number) => n * 60 * 1000

export const useStockByIdQuery = (id: number | null) =>
  useQuery({
    ...getApiTyStocksForCustommerByIdOptions({
      ...getHeaderTokenOnly(),
      path: { id: id! },
    }),
    // staleTime: minutes(1),
    enabled: typeof id === "number",
  })

export const useProductId = () => useNullableIntegerQueryState(QUERY_KEYS.productId)

export function useFinalProductPrices() {
  const profile = useAtomValue(profileAtom)
  const [productId] = useProductId()
  const { data: product } = useStockByIdQuery(productId)

  const productBasePrice = product?.price ?? 0
  const productDiffBuyPrice = product?.diffBuyPrice ?? 0
  const productDiffSellPrice = product?.diffSellPrice ?? 0
  const productUnit = product?.unit ?? 0

  const groupDiffBuyPrice = Number(profile.diffBuyPrice)
  const groupDiffSellPrice = Number(profile.diffSellPrice)
  const groupIntDiffBuyPrice = Number(profile.diffBuyPriceInt)
  const groupIntDiffSellPrice = Number(profile.diffSellPriceInt)

  const isGroupModeInt = productUnit === 1
  const selectedGroupDiffBuyPrice = isGroupModeInt ? groupIntDiffBuyPrice : groupDiffBuyPrice
  const selectedGroupDiffSellPrice = isGroupModeInt ? groupIntDiffSellPrice : groupDiffSellPrice

  const totalBuyPrice =
    (productBasePrice ?? 0) + selectedGroupDiffBuyPrice + (productDiffBuyPrice ?? 0)
  const totalSellPrice =
    (productBasePrice ?? 0) - selectedGroupDiffSellPrice - (productDiffSellPrice ?? 0)

  return { totalBuyPrice, totalSellPrice }
}

export const ProductStatus = {
  Disabled: 0,
  BuyOnly: 1,
  SellOnly: 2,
  BuyAndSell: 3,
}

export const ProductStatusFa = {
  [ProductStatus.Disabled]: "غیرفعال",
  [ProductStatus.BuyOnly]: "فقط قابل خرید",
  [ProductStatus.SellOnly]: "فقط قابل فروش",
  [ProductStatus.BuyAndSell]: "قابل خرید و فروش",
}

export function useGetProductSideEnabled(productStatus: StockStatus) {
  const profile = useAtomValue(profileAtom)
  const connectionState = useAtomValue(connectionStateAtom)

  const isDisabled = productStatus === ProductStatus.Disabled

  const isBuyingEnabled =
    productStatus !== ProductStatus.Disabled &&
    productStatus !== ProductStatus.SellOnly &&
    connectionState === "connected" &&
    !profile?.isBlock

  const isSellingEnabled =
    productStatus !== ProductStatus.Disabled &&
    productStatus !== ProductStatus.BuyOnly &&
    connectionState === "connected" &&
    !profile?.isBlock

  return { isDisabled, isSellingEnabled, isBuyingEnabled }
}

interface TradeFormStore {
  currentValue: number
  setCurrentValue: (currentValue: number) => void

  isRialMode: boolean
  setIsRialMode: (isRialMode: boolean) => void
}

export const useTradeFormStore = create<TradeFormStore>(set => ({
  currentValue: 0,
  setCurrentValue: currentValue => set({ currentValue }),

  isRialMode: false,
  setIsRialMode: isRialMode => set({ isRialMode }),
}))
