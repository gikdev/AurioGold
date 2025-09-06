import type { StockDto } from "@repo/api-client"

export const QUERY_KEYS = {
  productId: "product-id",
  side: "side",
  currentOrderId: "current-order-id",
  autoMinutes: "auto-minutes",
} as const

export type ProductId = NonNullable<StockDto["id"]>

export const ProductAutoMode = {
  Normal: 0,
  AutoAccept: 1,
  AutoReject: 2,
} as const
