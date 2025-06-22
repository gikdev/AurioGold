import { ArrowsLeftRightIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import { useBooleanishQueryState } from "@repo/shared/hooks"
import { formatPersianPrice } from "@repo/shared/utils"
import { useState } from "react"
import { QUERY_KEYS } from "../navigation"
import PriceInput from "./PriceInput"

export default function MainInput() {
  const [value, setValue] = useState(0)
  const [isRialMode, setRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const [errorMsg] = useState("")
  const currentUnit = isRialMode ? "ریال" : "گرم"
  const convertedUnit = isRialMode ? "گرم" : "ریال"
  const convertedValue = isRialMode ? 2.33 : 12_300_000

  const handleToggleBtnClick = () => setRialMode(r => !r)

  return (
    <div className="flex gap-2 flex-col">
      <div {...styles.inputWrapper}>
        <PriceInput {...styles.input} value={value} setValue={setValue} />

        <Btn title="تعویض حالت" {...styles.toggleBtn} onClick={handleToggleBtnClick}>
          <ArrowsLeftRightIcon size={20} />
        </Btn>
      </div>

      {value}

      <div className="text-xs flex justify-between">
        <p>
          ≈ {formatPersianPrice(convertedValue)} {convertedUnit}
        </p>
        <p>({currentUnit})</p>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-10">
          <WarningCircleIcon className="inline me-1" weight="fill" size={12} />
          <span>{errorMsg}</span>
        </p>
      )}
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
