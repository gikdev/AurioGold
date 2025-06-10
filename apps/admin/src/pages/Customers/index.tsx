import { HeadingLine } from "@repo/shared/layouts"
import ManageCustomers from "./ManageCustomers"
import type { CustomerDto } from "@repo/api-client/client"
import routes from "../routes"

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
