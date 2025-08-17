import { ArrowLeftIcon } from "@phosphor-icons/react"
import type { StockDto } from "@repo/api-client/client"
import { getApiTyStocksForCustommerOptions } from "@repo/api-client/tanstack"
import { createSelectWithOptions, Labeler } from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { type ChangeEvent, memo } from "react"
import { Link } from "react-router"
import routes from "#/pages/routes"
import { getHeaderTokenOnly } from "#/shared"
import { ProductStatus, useProductId } from "./shared"

const ProductSelect = createSelectWithOptions<StockDto>()

const keysConfig = {
  id: "id",
  text: "name",
  value: "id",
} as const

const select = (items: StockDto[]) => items.filter(i => i.status !== ProductStatus.Disabled)

function _SelectProduct() {
  const [productId, setProductId] = useProductId()
  const { data: products = [], status } = useQuery({
    ...getApiTyStocksForCustommerOptions(getHeaderTokenOnly()),
    select,
  })

  const errorMsg = typeof productId !== "number" ? "هیچ محصولی انتخاب نشده! لطفا انتخاب کنید." : ""

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductId(parseStrToNullableNumber(e.target.value))
  }

  return (
    <Labeler labelText="انتخاب محصول:" errorMsg={errorMsg} titleSlot={<AllProductsLink />}>
      <ProductSelect
        options={products}
        isLoading={status === "pending"}
        keys={keysConfig}
        value={productId ?? ""}
        onChange={handleProductChange}
        className={errorMsg ? "border-red-7" : ""}
      />
    </Labeler>
  )
}

export const SelectProduct = memo(_SelectProduct)

function AllProductsLink() {
  return (
    <Link
      to={routes.products}
      className="flex gap-1 items-center hover:text-brand-9 ms-auto transition-all"
    >
      <span>همه محصولات</span>
      <ArrowLeftIcon />
    </Link>
  )
}

function parseStrToNullableNumber(input: string | undefined | null | number): number | null {
  const converted = Number(input)
  const isNan = Number.isNaN(converted)
  return isNan ? null : converted
}
