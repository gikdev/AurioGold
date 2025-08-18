import type { ChangeEvent } from "react"
import { useProductId, useStockByIdQuery, useTradeFormStore } from "../shared"
import { transactionMethods } from "./shared"

export default function PriceInput() {
  const isRialMode = useTradeFormStore(s => s.isRialMode)
  const currentValue = useTradeFormStore(s => s.currentValue)
  const setCurrentValue = useTradeFormStore(s => s.setCurrentValue)
  const [productId] = useProductId()
  const { data: product } = useStockByIdQuery(productId)
  const transactionMethod = transactionMethods[product?.unit ?? 0]
  const maxDecimalsCount = product?.decimalNumber ?? 0
  const finalMaxDecimalsCount =
    isRialMode || transactionMethod.name === "count" ? 0 : maxDecimalsCount
  const step = calcStep(finalMaxDecimalsCount)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmed = Number(e.target.value).toFixed(finalMaxDecimalsCount)
    const converted = Number(trimmed)
    const isNan = Number.isNaN(converted)
    setCurrentValue(isNan ? 0 : converted)
  }

  // prevent nan form being in the input... (I know it's rare, but for safety's sake, let's just have it...)
  const handleBlur = () => {
    const converted = currentValue
    const isNan = Number.isNaN(converted)
    setCurrentValue(isNan ? 0 : converted)
  }

  return (
    <input
      dir="ltr"
      type="number"
      className="outline-none text-2xl text-slate-12 w-full font-bold"
      min={0}
      step={step}
      value={currentValue}
      onChange={handleChange}
      onBlur={handleBlur}
      data-testid="price-input"
    />
  )
}

function calcStep(maxDecimalsCount: number) {
  return maxDecimalsCount > 0
    ? `0.${Array(maxDecimalsCount - 1)
        .fill("0")
        .join("")}1`
    : "1"
}
