import { HeadingLine } from "@repo/shared/layouts"
import OrdersTable from "./OrdersTable"

export default function Orders() {
  return (
    <HeadingLine title="مدیریت سفارشات">
      <OrdersTable />
    </HeadingLine>
  )
}
