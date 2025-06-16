import type { StockDtoForMaster } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import { atom } from "jotai"
import ManageProducts from "./ManageProducts"

export const productsAtom = atom<Required<StockDtoForMaster>[]>([])

export default function Products() {
  return (
    <HeadingLine title="مدیریت محصولات">
      <ManageProducts />
    </HeadingLine>
  )
}
