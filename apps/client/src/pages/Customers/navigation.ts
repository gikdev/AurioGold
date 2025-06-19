import type { CustomerDto, StockDto } from "@repo/api-client/client"
import routes from "../routes"

export const QUERY_KEYS = {
  createNew: "new",
  edit: "edit",
  delete: "delete",
  details: "details",
  balance: "balance",
  transfer: "transfer",
  doc: "doc",
  customerId: "id",
  stockId: "stock-id",
  defaultMobile: "default-mobile",
} as const

type CustomerId = NonNullable<CustomerDto["id"]>
type StockId = NonNullable<StockDto["id"]>

export class CustomerNavigation {
  private static readonly baseUrl = routes.customers

  private static build(params: Record<string, string | number | boolean>) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params))
      if (value !== undefined && value !== null && value !== "")
        searchParams.set(key, String(value))

    return `${CustomerNavigation.baseUrl}?${searchParams.toString()}`
  }

  static createNew() {
    return CustomerNavigation.build({
      [QUERY_KEYS.createNew]: true,
    })
  }

  static edit(customerId: CustomerId) {
    return CustomerNavigation.build({
      [QUERY_KEYS.customerId]: customerId,
      [QUERY_KEYS.edit]: true,
    })
  }

  static delete(customerId: CustomerId) {
    return CustomerNavigation.build({
      [QUERY_KEYS.customerId]: customerId,
      [QUERY_KEYS.delete]: true,
    })
  }

  static details(customerId: CustomerId) {
    return CustomerNavigation.build({
      [QUERY_KEYS.customerId]: customerId,
      [QUERY_KEYS.details]: true,
    })
  }

  static balance(customerId: CustomerId) {
    return CustomerNavigation.build({
      [QUERY_KEYS.customerId]: customerId,
      [QUERY_KEYS.balance]: true,
    })
  }

  static doc(customerId: CustomerId) {
    return CustomerNavigation.build({
      [QUERY_KEYS.customerId]: customerId,
      [QUERY_KEYS.doc]: true,
    })
  }

  static transfer(customerId: CustomerId, stockId: StockId, defaultMobile = "") {
    return CustomerNavigation.build({
      [QUERY_KEYS.customerId]: customerId,
      [QUERY_KEYS.transfer]: true,
      [QUERY_KEYS.stockId]: stockId,
      [QUERY_KEYS.defaultMobile]: defaultMobile,
    })
  }
}
