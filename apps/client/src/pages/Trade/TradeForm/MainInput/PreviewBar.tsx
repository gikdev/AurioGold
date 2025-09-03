import { formatPersianPrice } from "@repo/shared/utils"
import { useProductContext } from "../ProductFetcher"
import { useTradeFormStore } from "../shared"
import { transactionMethods } from "./shared"

export default function PreviewBar() {
  const product = useProductContext()
  const mode = useTradeFormStore(s => s.mode)
  const weight = useTradeFormStore(s => s.weight)
  const rial = useTradeFormStore(s => s.rial)

  const transactionMethod = transactionMethods[product.unit]

  const convertedUnit = mode === "rial" ? transactionMethod.unitTitle : "ریال"
  const oppositeModeValue = mode === "rial" ? weight : rial

  return (
    <div className="flex justify-center items-center gap-2">
      <p className="flex items-center gap-1">
        <span>مساوی‌است با </span>
        <span> </span>
        <span className="text-2xl font-bold text-slate-12">
          {formatPersianPrice(oppositeModeValue)}
        </span>
        <span> </span>
        <span>{convertedUnit}</span>
      </p>
    </div>
  )
}
