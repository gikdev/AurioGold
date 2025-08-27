import {
  CardsIcon,
  CardsThreeIcon,
  CirclesThreePlusIcon,
  PackageIcon,
  TableIcon,
} from "@phosphor-icons/react"
import {
  BtnTemplates,
  ErrorCardBoundary,
  FloatingActionBtn,
  IconsToggle,
  type IconsToggleItem,
  LoadingSpinner,
  SmallErrorWithRetryBtn,
  TitledCard,
  type ViewMode,
} from "@repo/shared/components"
import { parseError } from "@repo/shared/helpers"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { connectionRefAtom } from "#/atoms"
import { DeleteProductModal } from "./DeleteProductModal"
import { ProductCards } from "./ProductCards"
import { ProductDetails } from "./ProductDetails"
import { ProductDrawer } from "./ProductDrawer"
import { ProductFullCards } from "./ProductFullCards"
import { ProductsTable } from "./ProductsTable"
import { applyStockUpdate, refetchStocks, useStocksQuery } from "./shared"
import { useProductsStore } from "./store"

export function ManageProducts() {
  return (
    <>
      <PriceUpdateManager />
      <CreateProductDrawer />
      <DeleteProductModalWrapper />
      <EditProductDrawer />
      <ProductDetailsWrapper />
      <ManageStuff />
    </>
  )
}

function PriceUpdateManager() {
  const connection = useAtomValue(connectionRefAtom)

  useEffect(() => {
    if (!connection) return
    connection.on("ReceivePriceUpdate", applyStockUpdate)
    return () => connection.off("ReceivePriceUpdate")
  }, [connection])

  return null
}

function CreateProductDrawer() {
  const reset = useProductsStore(s => s.reset)
  const mode = useProductsStore(s => s.mode)

  return (
    <ErrorCardBoundary>
      {mode === "create" && <ProductDrawer mode="create" onClose={reset} />}
    </ErrorCardBoundary>
  )
}

function DeleteProductModalWrapper() {
  const productId = useProductsStore(s => s.productId)
  const reset = useProductsStore(s => s.reset)
  const mode = useProductsStore(s => s.mode)

  return (
    <ErrorCardBoundary>
      {mode === "delete" && typeof productId === "number" && (
        <DeleteProductModal onClose={reset} productId={productId} />
      )}
    </ErrorCardBoundary>
  )
}

function EditProductDrawer() {
  const productId = useProductsStore(s => s.productId)
  const reset = useProductsStore(s => s.reset)
  const mode = useProductsStore(s => s.mode)

  return (
    <ErrorCardBoundary>
      {mode === "edit" && typeof productId === "number" && (
        <ProductDrawer mode="edit" onClose={reset} productId={productId} />
      )}
    </ErrorCardBoundary>
  )
}

function ProductDetailsWrapper() {
  const productId = useProductsStore(s => s.productId)
  const reset = useProductsStore(s => s.reset)
  const mode = useProductsStore(s => s.mode)

  return (
    <ErrorCardBoundary>
      {mode === "details" && typeof productId === "number" && (
        <ProductDetails onClose={reset} productId={productId} />
      )}
    </ErrorCardBoundary>
  )
}

function CreateProductFAB() {
  const createNew = useProductsStore(s => s.createNew)

  return (
    <FloatingActionBtn
      title="ایجاد محصول جدید"
      icon={CirclesThreePlusIcon}
      onClick={createNew}
      theme="success"
      fallback={<BtnTemplates.IconCreate title="ایجاد محصول جدید" onClick={createNew} />}
    />
  )
}

type ProductsViewMode = ViewMode | "full-cards"

const modes: IconsToggleItem<ProductsViewMode>[] = [
  { id: "full-cards", icon: CardsThreeIcon },
  { id: "cards", icon: CardsIcon },
  { id: "table", icon: TableIcon },
]

function ManageStuff() {
  const [viewMode, setViewMode] = useState<ProductsViewMode>("full-cards")
  const { data: stocks = [], isPending, isSuccess, isError, error, refetch } = useStocksQuery()

  const titleSlot = (
    <div className="flex items-center ms-auto gap-2">
      <BtnTemplates.IconReload onClick={refetchStocks} />
      <CreateProductFAB />
      <IconsToggle activeItemId={viewMode} items={modes} onChange={setViewMode} />
    </div>
  )

  return (
    <ErrorCardBoundary>
      <TitledCard
        title="مدیریت محصولات"
        icon={PackageIcon}
        titleSlot={titleSlot}
        className="max-w-240"
      >
        {isError && (
          <SmallErrorWithRetryBtn details={parseError(error)} onClick={() => refetch()} />
        )}
        {isPending && <LoadingSpinner />}
        {isSuccess && viewMode === "full-cards" && <ProductFullCards stocks={stocks} />}
        {isSuccess && viewMode === "cards" && <ProductCards stocks={stocks} />}
        {isSuccess && viewMode === "table" && <ProductsTable stocks={stocks} />}
      </TitledCard>
    </ErrorCardBoundary>
  )
}
