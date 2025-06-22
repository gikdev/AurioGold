import { useApiRequest } from "@gikdev/react-datapi/src"
import type { StockDto } from "@repo/api-client/client"
import { Labeler, createSelectWithOptions } from "@repo/shared/components"
import { useIntegerQueryState } from "@repo/shared/hooks"
import { useAtomValue, useSetAtom } from "jotai"
import type { ChangeEvent } from "react"
import { isAdminOnlineAtom } from "#/atoms"
import { transformStock } from "#/pages/Products/transformStock"
import { selectedProductAtom } from "."
import { ProductStatus } from "../ProductShared"
import { QUERY_KEYS } from "../navigation"

const ProductSelect = createSelectWithOptions<Required<StockDto>>()

const keysConfig = {
  id: "id",
  text: "name",
  value: "id",
} as const

export default function SelectProduct() {
  const setSelectedProduct = useSetAtom(selectedProductAtom)
  const isShopOnline = useAtomValue(isAdminOnlineAtom)
  const [productId, setProductId] = useIntegerQueryState(QUERY_KEYS.productId)
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
  const errorMsg = productId == null ? "هیچ محصولی انتخاب نشده! لطفا انتخاب کنید." : ""

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductId(parseStrToNullableNumber(e.target.value))

    const foundProduct = resProducts.data?.find(p => p.id === productId)
    setSelectedProduct(foundProduct ?? null)
  }

  return (
    <Labeler labelText="محصول:" errorMsg={errorMsg}>
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
