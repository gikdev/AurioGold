import { ArrowsDownUpIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import {
  useBooleanishQueryState,
  useIntegerQueryState,
  useLiteralQueryState,
} from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import { QUERY_KEYS } from "../../navigation"
import { useFinalProductPrices } from "../../shared"
import { selectedProductAtom, sides } from "../shared"
import { calcOutputRial, calcOutputWeight } from "./shared"

export default function RialModeToggle() {
  const [isRialMode, setRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const [value, setValue] = useIntegerQueryState(QUERY_KEYS.currentValue, 0)
  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)

  const selectedProduct = useAtomValue(selectedProductAtom)
  const basePrice = selectedProduct?.price ?? 0
  const maxDecimalsCount = selectedProduct?.decimalNumber ?? 0
  const priceToUnitRatio = selectedProduct?.unitPriceRatio ?? 1

  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: selectedProduct?.unit ?? 0,
    productBasePrice: selectedProduct?.price ?? 0,
    productDiffBuyPrice: selectedProduct?.diffBuyPrice ?? 0,
    productDiffSellPrice: selectedProduct?.diffSellPrice ?? 0,
  })

  const convertedValue = isRialMode
    ? calcOutputWeight(value, basePrice, priceToUnitRatio, isRialMode ? 0 : maxDecimalsCount)
    : calcOutputRial(value, side === "buy" ? totalBuyPrice : totalSellPrice, priceToUnitRatio)

  const handleToggleBtnClick = () => {
    setValue(convertedValue)
    setRialMode(r => !r)
  }

  return (
    <Btn title="تعویض حالت" {...styles.toggleBtn} onClick={handleToggleBtnClick}>
      <ArrowsDownUpIcon size={20} />
      <span>تعویض حالت</span>
    </Btn>
  )
}

const styles = {
  toggleBtn: ccn(`
    min-w-8 min-h-8 p-0 border-transparent font-light
    bg-transparent hover:bg-slate-3 text-xs
  `),
}
