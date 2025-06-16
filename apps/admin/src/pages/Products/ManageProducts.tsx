import { useApiRequest } from "@gikdev/react-datapi/src"
import { CirclesThreePlusIcon, PackageIcon } from "@phosphor-icons/react"
import type { StockDtoForMaster } from "@repo/api-client/client"
import {
  BtnTemplates,
  FloatingActionBtn,
  TitledCard,
  ViewModesToggle,
  useCurrentViewMode,
} from "@repo/shared/components"
import { getIsMobile } from "@repo/shared/hooks"
import { Link } from "react-router"
import CreateProductDrawer from "./CreateProductDrawer"
import DeleteProductsModal from "./DeleteProductModal"
import EditProductDrawer from "./EditProductDrawer"
import { ProductCards } from "./ProductCards"
import ProductDetails from "./ProductDetails"
import ProductsTable from "./ProductsTable"
import { Navigation } from "./navigation"
import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import { productsAtom } from "."
import { connectionRefAtom } from "#/atoms"

export default function ManageProducts() {
  const connection = useAtomValue(connectionRefAtom)
  const isMobile = getIsMobile()
  const viewMode = useCurrentViewMode()
  const setProductsAtom = useSetAtom(productsAtom)
  const previousResProductsRef = useRef<Required<StockDtoForMaster>[]>([])
  const resProducts = useApiRequest<Required<StockDtoForMaster>[], StockDtoForMaster[]>(() => ({
    url: "/TyStocks",
    defaultValue: [],
    transformResponse: rawItems => rawItems.map(requiredify),
  }))

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setProductsAtom(resProducts.data ?? [])
    previousResProductsRef.current = resProducts.data ?? []
  }, [resProducts.data])

  useEffect(() => {
    if (!connection) return
    connection.on("ReceivePriceUpdate", handleReceivePriceUpdate)
    return () => connection.off("ReceivePriceUpdate")
  }, [connection])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleReceivePriceUpdate = useCallback(
    (
      productId: NonNullable<StockDtoForMaster["id"]>,
      newPrice: number,
      priceType: "price" | "diffSellPrice" | "diffBuyPrice",
      date: string,
    ) => {
      setProductsAtom(draft => {
        const idx = draft.findIndex(p => p.id === productId)
        if (idx === -1) return
        draft[idx][priceType] = newPrice
        draft[idx].dateUpdate = date
      })
    },
    [],
  )

  const titleSlot = (
    <div className="flex items-center ms-auto gap-2">
      <BtnTemplates.IconReload onClick={() => resProducts.reload()} />
      <CreateProductFAB />
      <ViewModesToggle />
    </div>
  )

  return (
    <>
      <CreateProductDrawer reloadProducts={() => resProducts.reload()} />
      <DeleteProductsModal reloadProducts={() => resProducts.reload()} />
      <EditProductDrawer reloadProducts={() => resProducts.reload()} />
      <ProductDetails />

      <TitledCard
        title="مدیریت محصولات"
        icon={PackageIcon}
        titleSlot={titleSlot}
        className={!isMobile && viewMode === "table" ? "max-w-240" : undefined}
      >
        {viewMode === "cards" && <ProductCards products={resProducts.data ?? []} />}
        {viewMode === "table" && <ProductsTable products={resProducts.data ?? []} />}
      </TitledCard>
    </>
  )
}

const CreateProductFAB = () => (
  <FloatingActionBtn
    title="ایجاد محصول جدید"
    icon={CirclesThreePlusIcon}
    to={Navigation.createNew()}
    theme="success"
    fallback={
      <BtnTemplates.IconCreate as={Link} title="ایجاد محصول جدید" to={Navigation.createNew()} />
    }
  />
)

function requiredify(input: StockDtoForMaster): Required<StockDtoForMaster> {
  return {
    id: input.id ?? 0,
    name: input.name ?? "---",
    description: input.description ?? null,
    price: input.price ?? 0,
    diffBuyPrice: input.diffBuyPrice ?? 0,
    diffSellPrice: input.diffSellPrice ?? 0,
    priceStep: input.priceStep ?? 0,
    diffPriceStep: input.diffPriceStep ?? 0,
    status: input.status ?? 0,
    mode: input.mode ?? 0,
    maxAutoMin: input.maxAutoMin ?? 0,
    dateUpdate: input.dateUpdate ?? new Date(1).toISOString(),
    minValue: input.minValue ?? 0,
    maxValue: input.maxValue ?? 0,
    minVoume: input.minVoume ?? 0,
    maxVoume: input.maxVoume ?? 0,
    isCountable: input.isCountable ?? false,
    unitPriceRatio: input.unitPriceRatio ?? 0,
    decimalNumber: input.decimalNumber ?? 0,
    supply: input.supply ?? 0,
    priceSourceID: input.priceSourceID ?? null,
    accountCode: input.accountCode ?? null,
    unit: input.unit ?? 0,
  }
}
