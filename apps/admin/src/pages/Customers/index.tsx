import { HeadingLine } from "@repo/shared/layouts"
import ManageCustomers from "./ManageCustomers"

export default function Customers() {
  return (
    <HeadingLine title="مدیریت مشتریان">
      <ManageCustomers />
    </HeadingLine>
  )
}
