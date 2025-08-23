import type { ChangeEvent } from "react"
import { useProductContext } from "../ProductFetcher"
import {
  calcFinalProductPrices,
  type SafeStock,
  useProductSide,
  useTradeFormStore,
} from "../shared"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./shared"
import { useProfileAtom } from "#/atoms"

export default function PriceInput() {
  const [side] = useProductSide()
  const [profile] = useProfileAtom()
  const mode = useTradeFormStore(s => s.mode)
  const rial = useTradeFormStore(s => s.rial)
  const weight = useTradeFormStore(s => s.weight)
  const product = useProductContext()

  const maxDecimals = calcMaxDecimals(product, mode === "rial")
  const step = calcStep(maxDecimals)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmed = Number(e.target.value).toFixed(maxDecimals)
    const converted = Number(trimmed)
    const isNan = Number.isNaN(converted)

    const final = isNan ? 0 : converted

    const { totalBuyPrice, totalSellPrice } = calcFinalProductPrices({ product, profile })
    const totalSidePrice = side === "buy" ? totalBuyPrice : totalSellPrice

    if (mode === "rial") {
      useTradeFormStore.getState().setRial(final)

      const shouldHaveDecimals = transactionMethods[product.unit].name !== "count"

      const newWeight = calcOutputWeight(
        rial,
        totalSidePrice,
        product.unitPriceRatio,
        shouldHaveDecimals ? product.decimalNumber : 0,
      )

      useTradeFormStore.getState().setWeight(newWeight)

      return
    }

    if (mode === "weight") {
      useTradeFormStore.getState().setWeight(final)

      const newRial = calcOutputRial(weight, totalSidePrice, product.unitPriceRatio)

      useTradeFormStore.getState().setRial(newRial)

      return
    }
  }

  return (
    <input
      dir="ltr"
      type="number"
      className="outline-none text-2xl text-slate-12 w-full font-bold"
      min={0}
      step={step}
      value={mode === "rial" ? rial : weight}
      onChange={handleChange}
      data-testid="price-input"
    />
  )
}

function calcStep(maxDecimals: number) {
  return maxDecimals > 0
    ? `0.${Array(maxDecimals - 1)
        .fill("0")
        .join("")}1`
    : "1"
}

function calcMaxDecimals(product: SafeStock, isRialMode: boolean) {
  const transactionMethodName = transactionMethods[product.unit].name
  const shouldHaveDecimals = !isRialMode && transactionMethodName !== "count"
  const maxDecimals = shouldHaveDecimals ? product.decimalNumber : 0

  return maxDecimals
}
