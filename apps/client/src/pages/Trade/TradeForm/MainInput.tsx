import { ArrowsLeftRightIcon, WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import {
  useBooleanishQueryState,
  useIntegerQueryState,
  useLiteralQueryState,
} from "@repo/shared/hooks"
import { formatPersianPrice } from "@repo/shared/utils"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { selectedProductAtom } from "."
import { useFinalProductPrices } from "../ProductShared"
import { QUERY_KEYS } from "../navigation"
import { sides } from "./BuyAndSellToggleBtn"
import PriceInput from "./PriceInput"

const transactionMethods = [
  { code: 0, title: "گرمی", name: "gram" },
  { code: 1, title: "تعدادی", name: "count" },
  { code: 2, title: "مثقالی", name: "mesghal" },
] as const

function calcOutputWeight(
  rialValue: number,
  basePrice: number,
  priceToUnitRatio: number,
  maxDecimalCount: number,
) {
  const base = (rialValue / basePrice) * priceToUnitRatio
  const fixed = base.toFixed(maxDecimalCount)
  const numbered = Number.parseFloat(fixed)
  const isNan = Number.isNaN(numbered)
  return isNan ? 0 : numbered
}

function calcOutputRial(
  weightValue: number,
  totalSidePrice: number,
  priceToUnitRatio: number,
): number {
  return Math.round((weightValue * totalSidePrice) / priceToUnitRatio)
}

export default function MainInput() {
  const [isRialMode, setRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const basePrice = selectedProduct?.price ?? 0
  const transactionMethod = transactionMethods[selectedProduct?.unit ?? 0]
  const maxDecimalsCount = selectedProduct?.decimalNumber ?? 0
  const priceToUnitRatio = selectedProduct?.unitPriceRatio ?? 1

  const [value, setValue] = useIntegerQueryState(QUERY_KEYS.currentValue, 0)
  const [errorMsg] = useState("")

  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: selectedProduct?.unit ?? 0,
    productBasePrice: selectedProduct?.price ?? 0,
    productDiffBuyPrice: selectedProduct?.diffBuyPrice ?? 0,
    productDiffSellPrice: selectedProduct?.diffSellPrice ?? 0,
  })
  const currentUnit = isRialMode ? "ریال" : transactionMethod.title
  const convertedUnit = isRialMode ? transactionMethod.title : "ریال"
  const convertedValue = isRialMode
    ? calcOutputWeight(value, basePrice, priceToUnitRatio, isRialMode ? 0 : maxDecimalsCount)
    : calcOutputRial(value, side === "buy" ? totalBuyPrice : totalSellPrice, priceToUnitRatio)

  const handleToggleBtnClick = () => {
    setValue(convertedValue)
    setRialMode(r => !r)
  }

  const noteDecimalCount =
    transactionMethod.name === "count"
      ? "اعداد اعشاری وارد نکنید"
      : `تا ${maxDecimalsCount} عدد اعشار میشود وارد کرد`

  const pattern =
    transactionMethod.name === "count" ? "^[0-9]+$" : `^[0-9]+(.[0-9]{1,${maxDecimalsCount}})?$`

  return (
    <div className="flex gap-2 flex-col">
      <div {...styles.inputWrapper}>
        <PriceInput
          {...styles.input}
          value={value}
          setValue={setValue}
          pattern={pattern}
          maxDecimalsCount={isRialMode ? 0 : maxDecimalsCount}
          min={0}
        />

        <Btn title="تعویض حالت" {...styles.toggleBtn} onClick={handleToggleBtnClick}>
          <ArrowsLeftRightIcon size={20} />
        </Btn>
      </div>

      <div className="text-xs flex justify-between">
        <p>
          ≈ {formatPersianPrice(convertedValue)} {convertedUnit}
        </p>
        <p>({currentUnit})</p>
      </div>

      <div className="bg-slate-3 border-s-2 border-slate-7 rounded-md p-2 flex flex-col gap-2 relative mt-2">
        <WarningCircleIcon
          className="text-slate-12 font-bold absolute top-0 right-0 -translate-y-1/2 bg-slate-3 rounded-full p-1"
          size={24}
        />

        <ul className="text-xs list-disc ps-6">
          {errorMsg && (
            <li className=" text-red-10">
              <span>{errorMsg}</span>
              <WarningIcon className="inline ms-auto" weight="fill" size={12} />
            </li>
          )}
          <li>{noteDecimalCount}</li>
        </ul>
      </div>
    </div>
  )
}

const styles = {
  inputWrapper: ccn(`
    border-b-2 border-slate-7 has-focus:border-brand-9
    flex gap-2 py-2 flex-row-reverse 
  `),

  input: ccn(`
    outline-none text-2xl text-slate-12 w-full
  `),

  toggleBtn: ccn(`
    min-w-8 min-h-8 p-0 border-transparent
    bg-transparent hover:bg-slate-3
  `),
}
