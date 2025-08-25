import { atom, useSetAtom } from "jotai"
import type { ChangeEvent } from "react"
import z from "zod/v4"
import { useProfileAtom } from "#/atoms"
import { useProductContext } from "../ProductFetcher"
import { calcFinalProductPrices, type SafeStock, useTradeFormStore } from "../shared"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./shared"

export const priceInputErrorMsgAtom = atom("")

export default function PriceInput() {
  const side = useTradeFormStore(s => s.side)
  const [profile] = useProfileAtom()
  const mode = useTradeFormStore(s => s.mode)
  const rial = useTradeFormStore(s => s.rial)
  const weight = useTradeFormStore(s => s.weight)
  const product = useProductContext()
  const setErrorMsg = useSetAtom(priceInputErrorMsgAtom)

  const currentValue = mode === "rial" ? rial : weight
  const maxDecimals = calcMaxDecimals(product, mode === "rial")
  const step = calcStep(maxDecimals)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Make sure it's not negative...
    const trimmed = Number(e.target.value).toFixed(maxDecimals < 0 ? 0 : maxDecimals)
    const converted = Number(trimmed)
    const isNan = Number.isNaN(converted)

    const final = isNan ? 0 : converted

    const { totalBuyPrice, totalSellPrice } = calcFinalProductPrices({ product, profile })
    const totalSidePrice = side === "buy" ? totalBuyPrice : totalSellPrice

    if (mode === "rial") {
      useTradeFormStore.getState().setRial(final)

      const shouldHaveDecimals = transactionMethods[product.unit].name !== "count"

      const newWeight = calcOutputWeight(
        final,
        totalSidePrice,
        product.unitPriceRatio,
        shouldHaveDecimals ? product.decimalNumber : 0,
      )

      setErrorMsg(validateWeight(product, newWeight))
      useTradeFormStore.getState().setWeight(newWeight)

      return
    }

    if (mode === "weight") {
      setErrorMsg(validateWeight(product, final))
      useTradeFormStore.getState().setWeight(final)

      const newRial = calcOutputRial(final, totalSidePrice, product.unitPriceRatio)

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
      value={currentValue}
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
  const rawDecimals = shouldHaveDecimals ? product.decimalNumber : 0
  const clampedDecimals = rawDecimals < 0 ? 0 : rawDecimals

  return clampedDecimals
}

function validateWeight(product: SafeStock, weight: number) {
  const unitTitle = transactionMethods[product.unit].unitTitle

  const WeightSchema = z
    .number("وزن باید عدد باشد")
    .min(product.minVoume, `وزن باید حداقل ${product.minVoume} ${unitTitle} باشد`)
    .max(
      product.maxVoume,
      `وزن باید حداکثر ${product.maxVoume} ${unitTitle} باشد. برای مقادیر بیشتر با فروشگاه تماس بگیرید`,
    )
    .positive("وزن باید عددی مثبت باشد (بیشتر از ۰)")

  const result = WeightSchema.safeParse(weight)

  if (!result.success) {
    return result.error.issues.map(issue => issue.message).join(", ")
  }

  return ""
}
