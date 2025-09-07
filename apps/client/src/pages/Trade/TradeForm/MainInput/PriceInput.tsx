import { notifManager } from "@repo/shared/adapters"
import { atom, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import CurrencyInput from "react-currency-input-field"
import z from "zod/v4"
import { useProfileAtom } from "#/atoms"
import { useProductContext } from "../ProductFetcher"
import { calcFinalProductPrices, type SafeStock, useTradeFormStore } from "../shared"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./shared"

export const priceInputErrorMsgAtom = atom("")

export default function PriceInput() {
  const [profile] = useProfileAtom()
  const side = useTradeFormStore(s => s.side)
  const mode = useTradeFormStore(s => s.mode)
  const rial = useTradeFormStore(s => s.rial)
  const weight = useTradeFormStore(s => s.weight)
  const product = useProductContext()
  const setErrorMsg = useSetAtom(priceInputErrorMsgAtom)
  const [innerValue, setInnerValue] = useState("")

  const currentValue = mode === "rial" ? rial : weight
  const transactionMethodName = transactionMethods[product.unit].name
  const shouldHaveDecimals = mode !== "rial" && transactionMethodName !== "count"
  const maxDecimals = calcMaxDecimals(product, shouldHaveDecimals)
  const step = calcStep(maxDecimals)

  const handleChange = (value?: string) => {
    if (Number.isNaN(Number(value))) {
      notifManager.notify("not valid input value!", ["toast", "console"], { status: "dev-only" })
      return
    }

    // Make sure it's not negative...
    const trimmed = Number(value).toFixed(maxDecimals < 0 ? 0 : maxDecimals)
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only need handleChange
  useEffect(() => {
    handleChange(innerValue)
  }, [innerValue])

  useEffect(() => {
    setInnerValue(currentValue.toString())
  }, [currentValue])

  return (
    <CurrencyInput
      dir="ltr"
      className="outline-none text-2xl text-slate-12 w-full font-bold"
      min={0}
      step={Number(step)}
      value={innerValue}
      onValueChange={v => setInnerValue(v ?? "")}
      data-testid="price-input"
      allowDecimals={shouldHaveDecimals}
      decimalsLimit={maxDecimals}
      decimalScale={maxDecimals}
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

function calcMaxDecimals(product: SafeStock, shouldHaveDecimals: boolean) {
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
    return result.error.issues.map(issue => issue.message).join(" - ")
  }

  return ""
}
