import routes from "../routes"

export const QUERY_KEYS = {
  filter: "filter",
} as const

export class OrdersNavigation {
  private static readonly baseUrl = routes.orders

  private static build(params: Record<string, string | number | boolean>) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params))
      if (value !== undefined && value !== null && value !== "")
        searchParams.set(key, String(value))

    return `${OrdersNavigation.baseUrl}?${searchParams.toString()}`
  }

  static filter() {
    return OrdersNavigation.build({
      [QUERY_KEYS.filter]: true,
    })
  }
}
