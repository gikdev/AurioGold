import { HeadingLine } from "@repo/shared/layouts"
import { MainPageContent } from "./MainPageContent"
import ManageProducts from "./ManageProducts"

export default function Products() {
  return (
    <HeadingLine title="محصولات">
      <MainPageContent />

      <ManageProducts />
    </HeadingLine>
  )
}
