import type { StockDtoForMaster } from "@repo/api-client/client"
import { type ProductId, useProductsStore } from "../../../store"
import { ChangeA11yModal } from "./ChangeA11yModal"
import { calcA11yStuff } from "./calcA11yStuff"

interface A11yBtnProps {
  productId: ProductId
  status: StockDtoForMaster["status"]
}

export function A11yBtn({ status, productId }: A11yBtnProps) {
  const { Icon, classes, name } = calcA11yStuff(status)
  const mode = useProductsStore(s => s.mode)
  const storeProductId = useProductsStore(s => s.productId)

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-1 p-2 hover:bg-slate-4 cursor-pointer"
        onClick={() => useProductsStore.getState().changeA11y(productId)}
      >
        <Icon size={16} className={classes} />
        <span>{name}</span>
      </button>

      {mode === "changeA11y" && typeof productId === "number" && storeProductId === productId && (
        <ChangeA11yModal
          initialStatus={status}
          productId={productId}
          onClose={() => useProductsStore.getState().reset()}
        />
      )}
    </>
  )
}
