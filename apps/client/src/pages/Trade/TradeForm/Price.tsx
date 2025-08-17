import { formatPersianPrice } from "@repo/shared/utils"
import { useFinalProductPrices, useProductSide } from "./shared"

export default function Price() {
  const [side] = useProductSide()
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices()
  const verb = side === "buy" ? "خرید" : "فروش"
  const priceToShow = side === "buy" ? totalBuyPrice : totalSellPrice

  return (
    <p className="text-xs text-center flex items-center justify-center gap-1 flex-wrap">
      <span>قیمت </span>
      <span>{verb}: </span>
      <span dir="ltr" className="text-slate-12 font-bold">
        {formatPersianPrice(priceToShow)}
      </span>
      <span> ریال</span>
    </p>
  )
}
