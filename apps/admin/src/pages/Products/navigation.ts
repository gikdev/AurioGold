import routes from "../routes"

export const QUERY_KEYS = {
  createNew: "new",
  edit: "edit",
  delete: "delete",
  details: "details",
  productId: "product-id",
  changeA11y: "change-a11y",
} as const

type ProductId = number

export class Navigation {
  private static readonly baseUrl = routes.products

  private static build(params: Record<string, string | number | boolean>) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params))
      if (value !== undefined && value !== null && value !== "")
        searchParams.set(key, String(value))

    return `${Navigation.baseUrl}?${searchParams.toString()}`
  }

  static createNew() {
    return Navigation.build({
      [QUERY_KEYS.createNew]: true,
    })
  }

  static edit(productId: ProductId) {
    return Navigation.build({
      [QUERY_KEYS.productId]: productId,
      [QUERY_KEYS.edit]: true,
    })
  }

  static delete(productId: ProductId) {
    return Navigation.build({
      [QUERY_KEYS.productId]: productId,
      [QUERY_KEYS.delete]: true,
    })
  }

  static details(productId: ProductId) {
    return Navigation.build({
      [QUERY_KEYS.productId]: productId,
      [QUERY_KEYS.details]: true,
    })
  }
}
