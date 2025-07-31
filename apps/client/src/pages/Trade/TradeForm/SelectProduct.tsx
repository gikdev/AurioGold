import { useApiRequest } from "@gikdev/react-datapi/src"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import type { StockDto } from "@repo/api-client/client"
import { createSelectWithOptions, Labeler } from "@repo/shared/components"
import { useNullableIntegerQueryState } from "@repo/shared/hooks"
import { useAtomValue, useSetAtom } from "jotai"
import type { ChangeEvent } from "react"
import { Link } from "react-router"
import { isAdminOnlineAtom } from "#/atoms"
import { transformStock } from "#/pages/Products/transformStock"
import routes from "#/pages/routes"
import { QUERY_KEYS } from "../navigation"
import { ProductStatus } from "../shared"
import { selectedProductAtom } from "./shared"

const ProductSelect = createSelectWithOptions<Required<StockDto>>()

const keysConfig = {
  id: "id",
  text: "name",
  value: "id",
} as const

export default function SelectProduct() {
  const setSelectedProduct = useSetAtom(selectedProductAtom)
  const isShopOnline = useAtomValue(isAdminOnlineAtom)
  const [productId, setProductId] = useNullableIntegerQueryState(QUERY_KEYS.productId)
  const resProducts = useApiRequest<Required<StockDto>[] | null, StockDto[]>(() => ({
    url: "/TyStocks/ForCustommer",
    defaultValue: null,
    dependencies: [productId, isShopOnline],
    transformResponse: rawItems =>
      rawItems.map(transformStock).filter(p => p.status !== ProductStatus.Disabled),
    onSuccess(products) {
      const foundProduct = products?.find(p => p.id === productId)
      setSelectedProduct(foundProduct ?? null)
    },
  }))
  const errorMsg = typeof productId !== "number" ? "هیچ محصولی انتخاب نشده! لطفا انتخاب کنید." : ""

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductId(parseStrToNullableNumber(e.target.value))

    const foundProduct = resProducts.data?.find(p => p.id === productId)
    setSelectedProduct(foundProduct ?? null)
  }

  const titleSlot = (
    <Link
      to={routes.products}
      className="flex gap-1 items-center hover:text-brand-9 ms-auto transition-all"
    >
      <span>همه محصولات</span>
      <ArrowLeftIcon />
    </Link>
  )

  return (
    <Labeler labelText="انتخاب محصول:" errorMsg={errorMsg} titleSlot={titleSlot}>
      <ProductSelect
        options={resProducts.data ?? []}
        isLoading={resProducts.loading}
        keys={keysConfig}
        value={productId ?? ""}
        onChange={handleProductChange}
        className={errorMsg ? "border-red-7" : ""}
      />
    </Labeler>
  )
}

function parseStrToNullableNumber(input: string | undefined | null | number): number | null {
  const converted = Number(input)
  const isNan = Number.isNaN(converted)
  return isNan ? null : converted
}
