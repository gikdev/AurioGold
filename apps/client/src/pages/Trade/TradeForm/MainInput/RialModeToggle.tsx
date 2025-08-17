import { ArrowsDownUpIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import {
  useFinalProductPrices,
  useProductId,
  useProductSide,
  useStockByIdQuery,
  useTradeFormStore,
} from "../shared"
import { calcOutputRial, calcOutputWeight } from "./shared"

export default function RialModeToggle() {
  const [side] = useProductSide()
  const isRialMode = useTradeFormStore(s => s.isRialMode)
  const setRialMode = useTradeFormStore(s => s.setIsRialMode)
  const currentValue = useTradeFormStore(s => s.currentValue)
  const setCurrentValue = useTradeFormStore(s => s.setCurrentValue)

  const [productId] = useProductId()
  const { data: product } = useStockByIdQuery(productId)
  const basePrice = product?.price ?? 0
  const maxDecimalsCount = product?.decimalNumber ?? 0
  const priceToUnitRatio = product?.unitPriceRatio ?? 1

  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices()

  const convertedValue = isRialMode
    ? calcOutputWeight(currentValue, basePrice, priceToUnitRatio, isRialMode ? 0 : maxDecimalsCount)
    : calcOutputRial(
        currentValue,
        side === "buy" ? totalBuyPrice : totalSellPrice,
        priceToUnitRatio,
      )

  const handleToggleBtnClick = () => {
    setCurrentValue(convertedValue)
    setRialMode(!isRialMode)
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
