import type { StockStatus } from "@repo/api-client/client"
import { useAtomValue } from "jotai"
import { connectionStateAtom, profileAtom } from "#/atoms"

export function useFinalProductPrices({
  productBasePrice,
  productDiffBuyPrice,
  productDiffSellPrice,
  productUnit,
}: {
  productUnit: number
  productBasePrice: number
  productDiffBuyPrice: number
  productDiffSellPrice: number
}) {
  const profile = useAtomValue(profileAtom)

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
