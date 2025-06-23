import { WarningCircleIcon, WarningIcon } from "@phosphor-icons/react"
import { useBooleanishQueryState } from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { QUERY_KEYS } from "../../navigation"
import { selectedProductAtom } from "../shared"
import { transactionMethods } from "./shared"

export default function Msgs() {
  const [errorMsg] = useState("")
  const [isRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const transactionMethod = transactionMethods[selectedProduct?.unit ?? 0]
  const noDecimalSituation = transactionMethod.name === "count" || isRialMode
  const maxDecimalsCount = noDecimalSituation ? 0 : (selectedProduct?.decimalNumber ?? 0)
  const noteDecimalCount = noDecimalSituation
    ? "اعداد اعشاری وارد نکنید"
    : `تا ${maxDecimalsCount} عدد اعشار میشود وارد کرد`

  return (
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
  )
}
