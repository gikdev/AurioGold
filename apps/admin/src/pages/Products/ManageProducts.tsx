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
  TitledCard,
  type ViewMode,
} from "@repo/shared/components"
import { getIsMobile } from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { connectionRefAtom } from "#/atoms"
import CreateProductDrawer from "./CreateProductDrawer"
import DeleteProductsModal from "./DeleteProductModal"
import { EditProductDrawer } from "./EditProductDrawer"
import { Navigation } from "./navigation"
import { ProductCards } from "./ProductCards"
import ProductDetails from "./ProductDetails"
import { ProductFullCards } from "./ProductFullCards"
import ProductsTable from "./ProductsTable"
import { applyStockUpdate, refetchStocks } from "./shared"

type ProductsViewMode = ViewMode | "full-cards"

const modes: IconsToggleItem<ProductsViewMode>[] = [
  { id: "full-cards", icon: CardsThreeIcon },
  { id: "cards", icon: CardsIcon },
  { id: "table", icon: TableIcon },
]

export default function ManageProducts() {
  const connection = useAtomValue(connectionRefAtom)
  const isMobile = getIsMobile()
  const [viewMode, setViewMode] = useState<ProductsViewMode>("full-cards")
  const [showEditDrawer] = EditProductDrawer.useShow()

  useEffect(() => {
    if (!connection) return
    connection.on("ReceivePriceUpdate", applyStockUpdate)
    return () => connection.off("ReceivePriceUpdate")
  }, [connection])

  const titleSlot = (
    <div className="flex items-center ms-auto gap-2">
      <BtnTemplates.IconReload onClick={refetchStocks} />
      <CreateProductFAB />
      <IconsToggle activeItemId={viewMode} items={modes} onChange={setViewMode} />
    </div>
  )

  return (
    <>
      <ErrorCardBoundary>
        <CreateProductDrawer reloadProducts={refetchStocks} />
      </ErrorCardBoundary>

      <ErrorCardBoundary>
        <DeleteProductsModal reloadProducts={refetchStocks} />
      </ErrorCardBoundary>

      <ErrorCardBoundary>{showEditDrawer && <EditProductDrawer />}</ErrorCardBoundary>

      <ErrorCardBoundary>
        <ProductDetails />
      </ErrorCardBoundary>

      <TitledCard
        title="مدیریت محصولات"
        icon={PackageIcon}
        titleSlot={titleSlot}
        className={!isMobile && viewMode !== "cards" ? "max-w-240" : undefined}
      >
        {viewMode === "full-cards" && <ProductFullCards />}
        {viewMode === "cards" && <ProductCards />}
        {viewMode === "table" && <ProductsTable />}
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
