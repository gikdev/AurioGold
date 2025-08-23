import type {
  AutoMode,
  CustomerLoginModel,
  StockDto,
  StockStatus,
  StockUnit,
} from "@repo/api-client/client"
import { getApiTyStocksForCustommerByIdOptions } from "@repo/api-client/tanstack"
import { useLiteralQueryState } from "@repo/shared/hooks"
import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { useParams } from "react-router"
import { create } from "zustand"
import { profileAtom } from "#/atoms"
import { getHeaderTokenOnly } from "#/shared"
import { QUERY_KEYS } from "../navigation"

export const sides = ["buy", "sell"] as const
export type Side = (typeof sides)[number]
export const useProductSide = () => useLiteralQueryState(QUERY_KEYS.side, sides)

function toSafeDateStr(str: unknown, fallback = new Date().toISOString()): string {
  if (typeof str === "string") {
    const d = new Date(str)
    if (!Number.isNaN(d.getTime())) return d.toISOString()
  }

  return fallback
}
function toSafeNumber(n: unknown, fallback = 0) {
  return typeof n === "number" && !Number.isNaN(n) ? n : fallback
}
function toNullableNumber(n: unknown) {
  return typeof n === "number" && !Number.isNaN(n) ? n : null
}

const select = (stock: StockDto) =>
  ({
    id: 0,
    name: stock.name || "---",
    description: stock.description ?? null,
    price: toSafeNumber(stock.price),
    diffBuyPrice: toSafeNumber(stock.diffBuyPrice),
    diffSellPrice: toSafeNumber(stock.diffSellPrice),
    priceStep: toSafeNumber(stock.priceStep),
    diffPriceStep: toSafeNumber(stock.diffPriceStep),
    status: toSafeNumber(stock.status) as StockStatus,
    mode: toSafeNumber(stock.mode) as AutoMode,
    maxAutoMin: toSafeNumber(stock.maxAutoMin),
    dateUpdate: toSafeDateStr(stock.dateUpdate),
    minValue: toSafeNumber(stock.minValue),
    maxValue: toSafeNumber(stock.maxValue),
    minVoume: toSafeNumber(stock.minVoume),
    maxVoume: toSafeNumber(stock.maxVoume),
    isCountable: stock.isCountable ?? false,
    unitPriceRatio: toSafeNumber(stock.unitPriceRatio, 1),
    decimalNumber: toSafeNumber(stock.decimalNumber),
    supply: toSafeNumber(stock.supply),
    priceSourceID: toNullableNumber(stock.priceSourceID),
    unit: toSafeNumber(stock.unit) as StockUnit,
  }) satisfies Required<StockDto>

export type SafeStock = ReturnType<typeof select>

export const useStockByIdQuery = (id: number) =>
  useQuery({
    ...getApiTyStocksForCustommerByIdOptions({
      ...getHeaderTokenOnly(),
      path: { id },
    }),
    select,
  })

export function useProductId() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)

  return productId
}

export function calcFinalProductPrices({
  product,
  profile,
}: {
  product: SafeStock
  profile: Required<CustomerLoginModel>
}) {
  const groupDiffBuyPrice = toSafeNumber(profile.diffBuyPrice)
  const groupDiffSellPrice = toSafeNumber(profile.diffSellPrice)
  const groupIntDiffBuyPrice = toSafeNumber(profile.diffBuyPriceInt)
  const groupIntDiffSellPrice = toSafeNumber(profile.diffSellPriceInt)

  const isGroupModeInt = product.unit === 1
  const selectedGroupDiffBuyPrice = isGroupModeInt ? groupIntDiffBuyPrice : groupDiffBuyPrice
  const selectedGroupDiffSellPrice = isGroupModeInt ? groupIntDiffSellPrice : groupDiffSellPrice

  const totalBuyPrice = product.price + selectedGroupDiffBuyPrice + product.diffBuyPrice
  const totalSellPrice = product.price - selectedGroupDiffSellPrice - product.diffSellPrice

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

export function useGetProductSideEnabled(productStatus?: StockStatus) {
  const profile = useAtomValue(profileAtom)

  const isDisabled = productStatus === ProductStatus.Disabled

  const isBuyingEnabled =
    productStatus !== ProductStatus.SellOnly && !isDisabled && !profile?.isBlock

  const isSellingEnabled =
    productStatus !== ProductStatus.BuyOnly && !isDisabled && !profile?.isBlock

  return { isDisabled, isSellingEnabled, isBuyingEnabled }
}

interface TradeFormStore {
  mode: "rial" | "weight"
  setMode: (mode: "rial" | "weight") => void

  rial: number
  setRial: (rial: number) => void

  weight: number
  setWeight: (weight: number) => void
}

export const useTradeFormStore = create<TradeFormStore>(set => ({
  mode: "weight",
  setMode: mode => set({ mode }),

  rial: 0,
  setRial: rial => set({ rial }),

  weight: 0,
  setWeight: weight => set({ weight }),
}))
