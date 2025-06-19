import type { StockPriceSourceResponse } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import routes from "../routes"
import ManagePriceSources from "./ManagePriceSources"

export const queryStateKeys = {
  createNew: "create-new",
  edit: "edit",
  delete: "delete",
  details: "details",
}

export type PriceSourceId = StockPriceSourceResponse["id"]

export const queryStateUrls = {
  createNew: () => `${routes.priceSources}?${queryStateKeys.createNew}=true`,
  edit: (id: PriceSourceId) => `${routes.priceSources}?${queryStateKeys.edit}=${id}`,
  delete: (id: PriceSourceId) => `${routes.priceSources}?${queryStateKeys.delete}=${id}`,
  details: (id: PriceSourceId) => `${routes.priceSources}?${queryStateKeys.details}=${id}`,
}

export default function PriceSources() {
  return (
    <HeadingLine title="مدیریت منابع قیمت">
      <ManagePriceSources />
    </HeadingLine>
  )
}
