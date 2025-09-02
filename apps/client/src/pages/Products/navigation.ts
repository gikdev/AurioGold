import type { StockDto } from "@repo/api-client"

export const QUERY_KEYS = {
  details: "details",
  productId: "productId",
} as const

export type ProductId = NonNullable<StockDto["id"]>

export class Navigation {
  // private static readonly baseUrl = routes.products
  //
  // private static build(params: Record<string, string | number | boolean>) {
  //   const searchParams = new URLSearchParams()
  //   for (const [key, value] of Object.entries(params))
  //     if (value !== undefined && value !== null && value !== "")
  //       searchParams.set(key, String(value))
  //   return `${Navigation.baseUrl}?${searchParams.toString()}`
  // }
}
