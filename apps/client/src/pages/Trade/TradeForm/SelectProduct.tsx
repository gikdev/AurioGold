import { useApiRequest } from "@gikdev/react-datapi/src"
import type { StockDto } from "@repo/api-client/client"
import { createSelectWithOptions } from "@repo/shared/components"
import { useIntegerQueryState } from "@repo/shared/hooks"
import { useSetAtom } from "jotai"
import type { ChangeEvent } from "react"
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
  const [productId, setProductId] = useIntegerQueryState(QUERY_KEYS.productId)
  const resProducts = useApiRequest<Required<StockDto>[] | null, StockDto[]>(() => ({
    url: "/TyStocks/ForCustommer",
    defaultValue: null,
    dependencies: [productId],
    transformResponse: rawItems =>
      rawItems.map(transformStock).filter(p => p.status !== ProductStatus.Disabled),
    onSuccess(products) {
      const foundProduct = products?.find(p => p.id === productId)
      setSelectedProduct(foundProduct ?? null)
    },
  }))

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductId(parseStrToNullableNumber(e.target.value))

    const foundProduct = resProducts.data?.find(p => p.id === productId)
    setSelectedProduct(foundProduct ?? null)
  }

  return (
    <ProductSelect
      options={resProducts.data ?? []}
      isLoading={resProducts.loading}
      keys={keysConfig}
      value={productId ?? undefined}
      onChange={handleProductChange}
    />
  )
}

function parseStrToNullableNumber(input: string | undefined | null | number): number | null {
  const converted = Number(input)
  const isNan = Number.isNaN(converted)
  return isNan ? null : converted
}
