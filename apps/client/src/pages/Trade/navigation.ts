import type { StockDto } from "@repo/api-client/client"
import routes from "../routes"

export const QUERY_KEYS = {
  productId: "product-id",
  side: "side",
  rialMode: "rial-mode",
  currentValue: "current-value",
  currentOrderId: "current-order-id",
  autoMinutes: "auto-minutes",
} as const

export type ProductId = NonNullable<StockDto["id"]>

export class TradeNavigation {
  private static readonly baseUrl = routes.trade

  private static build(params: Record<string, string | number | boolean>) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params))
      if (value !== undefined && value !== null && value !== "")
        searchParams.set(key, String(value))

    return `${TradeNavigation.baseUrl}?${searchParams.toString()}`
  }

  static productId(productId: ProductId) {
    return TradeNavigation.build({
      [QUERY_KEYS.productId]: productId,
    })
  }

  static openOrderModal(orderId: number, autoMinutes: number) {
    return TradeNavigation.build({
      [QUERY_KEYS.currentOrderId]: orderId,
      [QUERY_KEYS.autoMinutes]: autoMinutes,
    })
  }
}
