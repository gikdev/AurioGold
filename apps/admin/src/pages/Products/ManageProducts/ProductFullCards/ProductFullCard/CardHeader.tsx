import { CaretLeftIcon, PackageIcon } from "@phosphor-icons/react"
import type { StockDtoForMaster } from "@repo/api-client/client"
import { type ProductId, useProductsStore } from "../../store"

interface CardHeaderProps {
  productId: ProductId
  name: NonNullable<StockDtoForMaster["name"]>
}

export function CardHeader({ productId, name }: CardHeaderProps) {
  return (
    <button
      type="button"
      onClick={() => useProductsStore.getState().details(productId)}
      className="flex items-center gap-1 hover:bg-slate-4 p-2 cursor-pointer"
    >
      <PackageIcon size={20} />
      <span>{name}</span>

      <CaretLeftIcon className="ms-auto" />
    </button>
  )
}
