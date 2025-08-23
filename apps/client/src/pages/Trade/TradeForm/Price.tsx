import { formatPersianPrice } from "@repo/shared/utils"
import { useProfileAtom } from "#/atoms"
import { useProductContext } from "./ProductFetcher"
import { calcFinalProductPrices, useProductSide } from "./shared"

export default function Price() {
  const [side] = useProductSide()
  const product = useProductContext()
  const [profile] = useProfileAtom()
  const { totalBuyPrice, totalSellPrice } = calcFinalProductPrices({ product, profile })

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
