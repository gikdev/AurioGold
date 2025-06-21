import { CaretLeftIcon, PackageIcon } from "@phosphor-icons/react"
import type { StockDto, StockStatus, StockUnit } from "@repo/api-client/client"
import { ccn } from "@repo/shared/helpers"
import { motionPresets } from "@repo/shared/lib"
import { formatPersianPrice } from "@repo/shared/utils"
import { motion } from "motion/react"
import { useNavigate } from "react-router"
import routes from "../routes"
import { useFinalProductPrices, useGetProductSideEnabled } from "./ProductById/ProductShared"

const styles = {
  container: ccn(`
    border-slate-7 bg-slate-3 hover:bg-slate-4
    rounded-md p-2 sm:items-center cursor-pointer
    flex gap-2 flex-col sm:flex-row border
  `),

  titleContainer: ccn(`
    flex gap-1 items-center sm:me-auto
    justify-between sm:justify-start
  `),

  priceContainer: ccn(`
    flex items-center gap-2 justify-between
    sm:justify-start
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
}

export default function ProductCard({
  diffSellPrice,
  name,
  productId,
  diffBuyPrice,
  basePrice,
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
    navigate(routes.trade_productById(productId))
  }

  if (isDisabled) return null

  return (
    <motion.button
      type="button"
      {...motionPresets.btn}
      {...styles.container}
      onClick={handleProductClick}
    >
      <p {...styles.titleContainer}>
        <PackageIcon size={20} />
        <span>{name}</span>

        <CaretLeftIcon size={20} className="inline-block sm:hidden ms-auto" />
      </p>

      <div {...styles.priceContainer}>
        {isBuyingEnabled ? (
          <p title="قیمت خرید (ریال)" className="text-green-10" dir="ltr">
            {formatPersianPrice(totalBuyPrice)}
          </p>
        ) : (
          <p title="قیمت خرید (ریال)" className="text-slate-10" dir="ltr">
            -
          </p>
        )}

        {isSellingEnabled ? (
          <p title="قیمت فروش (ریال)" className="text-red-10" dir="ltr">
            {formatPersianPrice(totalSellPrice)}
          </p>
        ) : (
          <p title="قیمت فروش (ریال)" className="text-slate-10" dir="ltr">
            -
          </p>
        )}
      </div>

      <CaretLeftIcon size={20} className="hidden sm:inline-block" />
    </motion.button>
  )
}
