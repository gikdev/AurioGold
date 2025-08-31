import { HeadingLine } from "@repo/shared/layouts"
import { FilterDrawer } from "./FilterDrawer"
import { useDateFilterStore } from "./shared"
import { Tables } from "./Tables"

export default function Orders() {
  return (
    <HeadingLine
      title="مدیریت سفارشات"
      containerClassName="flex flex-col flex-1"
      className="flex flex-col flex-1"
    >
      <FilterDrawerWrapper />
      <Tables />
    </HeadingLine>
  )
}

function FilterDrawerWrapper() {
  const isOpen = useDateFilterStore(s => s.isOpen)

  return isOpen && <FilterDrawer />
}
