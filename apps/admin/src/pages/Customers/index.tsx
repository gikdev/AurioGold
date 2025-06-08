import { HeadingLine } from "@repo/shared/layouts"
import ManageCustomers from "./ManageCustomers"

export const queryStateKeys = {
  createNew: "create-new",
  edit: "edit",
  delete: "delete",
  details: "details",
}

export default function Customers() {
  return (
    <HeadingLine title="مدیریت مشتریان">
      <ManageCustomers />
    </HeadingLine>
  )
}
