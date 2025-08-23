import { useProductContext } from "../ProductFetcher"
import { useTradeFormStore } from "../shared"
import { transactionMethods } from "./shared"

export function ShowCurrentUnit() {
  const mode = useTradeFormStore(s => s.mode)
  const product = useProductContext()
  const unitTitle = transactionMethods[product.unit].unitTitle
  const currentUnit = mode === "rial" ? "ریال" : unitTitle

  return (
    <p className="leading-none max-w-max max-h-max border-e pe-2 border-slate-6">{currentUnit}</p>
  )
}
