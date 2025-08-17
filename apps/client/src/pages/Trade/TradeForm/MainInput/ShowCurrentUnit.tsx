import { useProductId, useStockByIdQuery, useTradeFormStore } from "../shared"
import { transactionMethods } from "./shared"

export function ShowCurrentUnit() {
  const isRialMode = useTradeFormStore(s => s.isRialMode)
  const [productId] = useProductId()
  const { data: product } = useStockByIdQuery(productId)
  const transactionMethod = transactionMethods[product?.unit ?? 0]
  const currentUnit = isRialMode ? "ریال" : transactionMethod.unitTitle

  return (
    <p className="leading-none max-w-max max-h-max border-e pe-2 border-slate-6">{currentUnit}</p>
  )
}
