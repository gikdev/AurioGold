import type { StockDto } from "@repo/api-client"

export const QUERY_KEYS = {
  details: "details",
  productId: "productId",
} as const

export type ProductId = NonNullable<StockDto["id"]>
