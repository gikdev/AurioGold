import { useLiteralQueryState } from "@repo/shared/hooks"
import { formatPersianPrice } from "@repo/shared/utils"
import { useAtomValue } from "jotai"
import { selectedProductAtom } from "."
import { useFinalProductPrices } from "../ProductShared"
import { QUERY_KEYS } from "../navigation"
import { sides } from "./BuyAndSellToggleBtn"

export default function Price() {
  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: selectedProduct?.unit ?? 0,
    productBasePrice: selectedProduct?.price ?? 0,
    productDiffBuyPrice: selectedProduct?.diffBuyPrice ?? 0,
    productDiffSellPrice: selectedProduct?.diffSellPrice ?? 0,
  })
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
