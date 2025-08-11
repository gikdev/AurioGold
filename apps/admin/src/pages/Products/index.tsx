import type { StockDtoForMaster } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import { atomWithImmer } from "jotai-immer"
import ManageProducts from "./ManageProducts"

export const productsAtom = atomWithImmer<StockDtoForMaster[]>([])

export default function Products() {
  return (
    <HeadingLine title="مدیریت محصولات">
      <ManageProducts />
    </HeadingLine>
  )
}
