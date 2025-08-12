import { CaretLeftIcon, ClockIcon, PackageIcon } from "@phosphor-icons/react"
import type { StockDto, StockStatus, StockUnit } from "@repo/api-client/client"
import { ccn } from "@repo/shared/helpers"
import { cellRenderers } from "@repo/shared/lib"
import { formatPersianPrice } from "@repo/shared/utils"
import { useNavigate } from "react-router"
import { TradeNavigation } from "../Trade/navigation"
import { useFinalProductPrices, useGetProductSideEnabled } from "../Trade/shared"

const styles = {
  container: ccn(`
    border-slate-7 bg-slate-3 hover:bg-slate-4
    rounded-md p-2 cursor-pointer flex-col
    flex gap-2 border flex-1 min-w-40 min-w-max
  `),

  titleContainer: ccn(`
    flex gap-1 items-center justify-between w-full
  `),

  priceContainer: ccn(`
    flex items-center gap-2 justify-between w-full
  `),
}

interface ProductCardProps {
  productId: NonNullable<StockDto["id"]>
  name: string
  diffBuyPrice: number
  diffSellPrice: number
  basePrice: number
  unit: StockUnit
  status: StockStatus
  updateDate: string
}

export default function ProductCard({
  diffSellPrice,
  name,
  productId,
  diffBuyPrice,
  basePrice,
  updateDate,
  unit,
  status,
}: ProductCardProps) {
  const navigate = useNavigate()
  const { isBuyingEnabled, isSellingEnabled, isDisabled } = useGetProductSideEnabled(status)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: unit,
    productBasePrice: basePrice ?? 0,
    productDiffBuyPrice: diffBuyPrice ?? 0,
    productDiffSellPrice: diffSellPrice ?? 0,
  })

  const handleProductClick = () => {
    navigate(TradeNavigation.productId(productId))
  }

  if (isDisabled) return null

  return (
    <button
      type="button"
      {...styles.container}
      onClick={handleProductClick}
      data-testid="product-card"
    >
      <p {...styles.titleContainer}>
        <PackageIcon size={20} />
        <span data-testid="product-card-title">{name}</span>

        <CaretLeftIcon size={20} className="inline-block ms-auto" />
      </p>

      <div {...styles.priceContainer}>
        <p
          dir="ltr"
          title="قیمت خرید (ریال)"
          className={isBuyingEnabled ? "text-green-10" : "text-slate-10"}
        >
          {isBuyingEnabled ? formatPersianPrice(totalBuyPrice) : "-"}
        </p>

        <p
          dir="ltr"
          title="قیمت فروش (ریال)"
          className={isSellingEnabled ? "text-red-10" : "text-slate-10"}
        >
          {isSellingEnabled ? formatPersianPrice(totalSellPrice) : "-"}
        </p>
      </div>

      <p
        dir="ltr"
        title="آخرین آپدیت"
        className="text-slate-10 text-xs text-start flex items-center gap-0.5 w-full"
      >
        <ClockIcon />
        <cellRenderers.DateAndTime value={updateDate} />
      </p>
    </button>
  )
}
