import { HeadingLine } from "@repo/shared/layouts"
import { ManageProducts } from "./ManageProducts"

export default function Products() {
  return (
    <HeadingLine
      title="مدیریت محصولات"
      className="flex flex-col flex-1"
      containerClassName="flex flex-col flex-1"
    >
      <ManageProducts />
    </HeadingLine>
  )
}
