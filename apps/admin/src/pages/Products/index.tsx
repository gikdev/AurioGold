import type { StockDtoForMaster } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import ManageProducts from "./ManageProducts"
import { atomWithImmer } from "jotai-immer"

export const productsAtom = atomWithImmer<Required<StockDtoForMaster>[]>([])

export default function Products() {
  return (
    <HeadingLine title="مدیریت محصولات">
      <ManageProducts />
    </HeadingLine>
  )
}
