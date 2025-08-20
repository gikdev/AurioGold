import { ArrowLeftIcon } from "@phosphor-icons/react"
import type { StockDto } from "@repo/api-client/client"
import {
  getApiTyStocksForCustommerByIdQueryKey,
  getApiTyStocksForCustommerOptions,
  getApiTyStocksForCustommerQueryKey,
} from "@repo/api-client/tanstack"
import { createSelectWithOptions, Labeler } from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { produce } from "immer"
import { useAtomValue } from "jotai"
import { type ChangeEvent, memo, useCallback, useEffect } from "react"
import { Link } from "react-router"
import { connectionRefAtom } from "#/atoms"
import routes from "#/pages/routes"
import { getHeaderTokenOnly, queryClient } from "#/shared"
import type { ProductId } from "../navigation"
import { ProductStatus, useProductId, useTradeFormStore } from "./shared"

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

  useHandlePriceUpdate(productId)

  const errorMsg = typeof productId !== "number" ? "هیچ محصولی انتخاب نشده! لطفا انتخاب کنید." : ""

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setProductId(parseStrToNullableNumber(e.target.value))
    useTradeFormStore.getState().resetCurrentValue()
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

function useHandlePriceUpdate(productId: ProductId | null) {
  const connection = useAtomValue(connectionRefAtom)

  const handlePriceUpdate = useCallback(
    (
      id: ProductId,
      newPrice: number,
      priceType: "price" | "diffSellPrice" | "diffBuyPrice",
      date: string,
    ) => {
      if (typeof productId !== "number") return
      if (id !== productId) return

      const byIdQueryKey = getApiTyStocksForCustommerByIdQueryKey({
        ...getHeaderTokenOnly(),
        path: { id: productId },
      })

      // update the single product
      queryClient.setQueryData<StockDto>(byIdQueryKey, old =>
        old
          ? produce(old, draft => {
              draft[priceType] = newPrice
              draft.dateUpdate = date
            })
          : old,
      )

      // update the same product in the "all products" cache
      queryClient.setQueryData<StockDto[] | undefined>(
        getApiTyStocksForCustommerQueryKey(getHeaderTokenOnly()),
        oldData =>
          produce(oldData, draft => {
            if (!draft) return
            const stock = draft.find(p => p.id === productId)
            if (stock) {
              stock[priceType] = newPrice
              stock.dateUpdate = new Date(date).toISOString()
            }
          }),
      )
    },
    [productId],
  )

  useEffect(() => {
    connection?.on("ReceivePriceUpdate", handlePriceUpdate)
    return () => connection?.off("ReceivePriceUpdate", handlePriceUpdate)
  }, [connection, handlePriceUpdate])
}
