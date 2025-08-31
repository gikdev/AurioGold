import { HeadingLine } from "@repo/shared/layouts"
import OrdersTable from "./OrdersTable"

export default function Orders() {
  return (
    <HeadingLine
      title="مدیریت سفارشات"
      className="flex flex-col flex-1"
      containerClassName="flex flex-col flex-1"
    >
      <OrdersTable />
    </HeadingLine>
  )
}
