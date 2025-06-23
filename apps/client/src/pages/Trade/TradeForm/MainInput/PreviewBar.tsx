import {
  useBooleanishQueryState,
  useIntegerQueryState,
  useLiteralQueryState,
} from "@repo/shared/hooks"
import { formatPersianPrice } from "@repo/shared/utils"
import { useAtomValue } from "jotai"
import { QUERY_KEYS } from "../../navigation"
import { useFinalProductPrices } from "../../shared"
import { selectedProductAtom, sides } from "../shared"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./shared"

export default function PreviewBar() {
  const [isRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const [value] = useIntegerQueryState(QUERY_KEYS.currentValue, 0)
  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)

  const selectedProduct = useAtomValue(selectedProductAtom)
  const basePrice = selectedProduct?.price ?? 0
  const transactionMethod = transactionMethods[selectedProduct?.unit ?? 0]
  const maxDecimalsCount = selectedProduct?.decimalNumber ?? 0
  const priceToUnitRatio = selectedProduct?.unitPriceRatio ?? 1

  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: selectedProduct?.unit ?? 0,
    productBasePrice: selectedProduct?.price ?? 0,
    productDiffBuyPrice: selectedProduct?.diffBuyPrice ?? 0,
    productDiffSellPrice: selectedProduct?.diffSellPrice ?? 0,
  })

  const currentUnit = isRialMode ? "ریال" : transactionMethod.unitTitle
  const convertedUnit = isRialMode ? transactionMethod.unitTitle : "ریال"
  const convertedValue = isRialMode
    ? calcOutputWeight(value, basePrice, priceToUnitRatio, isRialMode ? 0 : maxDecimalsCount)
    : calcOutputRial(value, side === "buy" ? totalBuyPrice : totalSellPrice, priceToUnitRatio)

  return (
    <div className="text-xs flex justify-between">
      <p>
        ≈ {formatPersianPrice(convertedValue)} {convertedUnit}
      </p>
      <p>
        ({formatPersianPrice(value)} {currentUnit})
      </p>
    </div>
  )
}
