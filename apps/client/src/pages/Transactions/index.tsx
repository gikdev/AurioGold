import { HeadingLine } from "@repo/shared/layouts"
import { FilterDrawer } from "./FilterDrawer"
import { useDateFilterStore } from "./shared"
import TransactionsTable from "./TransactionsTable"

export default function Transactions() {
  return (
    <HeadingLine
      title="تراکنش‌ها"
      className="flex flex-col flex-1"
      containerClassName="flex flex-col flex-1"
    >
      <FilterDrawerWrapper />
      <TransactionsTable />
    </HeadingLine>
  )
}

function FilterDrawerWrapper() {
  const isOpen = useDateFilterStore(s => s.isOpen)

  return isOpen && <FilterDrawer />
}
