import type { CustomerDto } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import routes from "../routes"
import ManageCustomers from "./ManageCustomers"

export const queryStateKeys = {
  createNew: "create-new",
  edit: "edit",
  delete: "delete",
  details: "details",
}

export const queryStateUrls = {
  createNew: () => `${routes.customers}?${queryStateKeys.createNew}=true`,
  edit: (id: CustomerDto["id"]) => `${routes.customers}?${queryStateKeys.edit}=${id}`,
  delete: (id: CustomerDto["id"]) => `${routes.customers}?${queryStateKeys.delete}=${id}`,
  details: (id: CustomerDto["id"]) => `${routes.customers}?${queryStateKeys.details}=${id}`,
}

export default function Customers() {
  return (
    <HeadingLine title="مدیریت مشتریان">
      <ManageCustomers />
    </HeadingLine>
  )
}
