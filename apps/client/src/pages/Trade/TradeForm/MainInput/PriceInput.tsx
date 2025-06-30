import { useBooleanishQueryState, useIntegerQueryState } from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import type { ChangeEvent } from "react"
import { QUERY_KEYS } from "../../navigation"
import { selectedProductAtom } from "../shared"
import { transactionMethods } from "./shared"

export default function PriceInput() {
  const [isRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const [value, setValue] = useIntegerQueryState(QUERY_KEYS.currentValue, 0)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const transactionMethod = transactionMethods[selectedProduct?.unit ?? 0]
  const maxDecimalsCount = selectedProduct?.decimalNumber ?? 0
  const finalMaxDecimalsCount =
    isRialMode || transactionMethod.name === "count" ? 0 : maxDecimalsCount
  const step = calcStep(finalMaxDecimalsCount)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmed = Number(e.target.value).toFixed(finalMaxDecimalsCount)
    const converted = Number(trimmed)
    const isNan = Number.isNaN(converted)
    setValue(isNan ? 0 : converted)
  }

  const handleBlur = () => {
    const converted = value
    const isNan = Number.isNaN(converted)
    setValue(isNan ? 0 : converted)
  }

  return (
    <input
      dir="ltr"
      type="number"
      className="outline-none text-2xl text-slate-12 w-full font-bold"
      min={0}
      step={step}
      value={value}
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
