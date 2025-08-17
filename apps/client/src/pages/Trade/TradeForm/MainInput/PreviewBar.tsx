import { formatPersianPrice } from "@repo/shared/utils"
import {
  useFinalProductPrices,
  useProductId,
  useProductSide,
  useStockByIdQuery,
  useTradeFormStore,
} from "../shared"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./shared"

export default function PreviewBar() {
  const isRialMode = useTradeFormStore(s => s.isRialMode)
  const currentValue = useTradeFormStore(s => s.currentValue)
  const [side] = useProductSide()

  const [productId] = useProductId()
  const { data: product } = useStockByIdQuery(productId)
  const basePrice = product?.price ?? 0
  const transactionMethod = transactionMethods[product?.unit ?? 0]
  const maxDecimalsCount = product?.decimalNumber ?? 0
  const priceToUnitRatio = product?.unitPriceRatio ?? 1

  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices()

  const convertedUnit = isRialMode ? transactionMethod.unitTitle : "ریال"
  const convertedValue = isRialMode
    ? calcOutputWeight(currentValue, basePrice, priceToUnitRatio, isRialMode ? 0 : maxDecimalsCount)
    : calcOutputRial(
        currentValue,
        side === "buy" ? totalBuyPrice : totalSellPrice,
        priceToUnitRatio,
      )

  return (
    <div className="flex justify-center items-center gap-2">
      <p className="flex items-center gap-1">
        <span>مساوی‌است با </span>
        <span> </span>
        <span className="text-2xl font-bold text-slate-12">
          {formatPersianPrice(convertedValue)}
        </span>
        <span> </span>
        <span>{convertedUnit}</span>
      </p>
    </div>
  )
}
