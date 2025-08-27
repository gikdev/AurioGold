import { HeadingLine } from "@repo/shared/layouts"
import { FilterDrawer } from "./FilterDrawer"
import { OrdersTable } from "./OrdersTable"
import { StocksTable } from "./StocksTable"
import { useDateFilterStore } from "./shared"

export default function Orders() {
  return (
    <HeadingLine title="مدیریت سفارشات">
      <Tables />
    </HeadingLine>
  )
}

function Tables() {
  return (
    <div className="flex flex-col gap-10">
      <FilterDrawerWrapper />
      <OrdersTable />
      <StocksTable />
    </div>
  )
}

function FilterDrawerWrapper() {
  const isOpen = useDateFilterStore(s => s.isOpen)

  return isOpen && <FilterDrawer />
}
