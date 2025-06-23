import { CheckCircleIcon, CircleIcon, WarningCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { BtnTemplates } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import {
  useBooleanishQueryState,
  useIntegerQueryState,
  useLiteralQueryState,
} from "@repo/shared/hooks"
import { formatPersianString } from "@repo/shared/utils"
import { atom, useAtom, useAtomValue } from "jotai"
import { useEffect } from "react"
import { QUERY_KEYS } from "../../navigation"
import { useFinalProductPrices } from "../../shared"
import { selectedProductAtom, sides } from "../shared"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./shared"

type RuleStatus = "empty" | "success" | "error"

export const notesStatusAtom = atom<{
  maxVolume: RuleStatus
  minVolume: RuleStatus
  maxDecimal: RuleStatus
}>({
  maxVolume: "empty",
  minVolume: "empty",
  maxDecimal: "empty",
})

export default function Notes() {
  const selectedProduct = useAtomValue(selectedProductAtom)
  const [notesStatus, setNotesStatus] = useAtom(notesStatusAtom)
  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)
  const [value] = useIntegerQueryState(QUERY_KEYS.currentValue, 0)
  const [isRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: selectedProduct?.unit ?? 0,
    productBasePrice: selectedProduct?.price ?? 0,
    productDiffBuyPrice: selectedProduct?.diffBuyPrice ?? 0,
    productDiffSellPrice: selectedProduct?.diffSellPrice ?? 0,
  })

  const transactionMethod = transactionMethods[selectedProduct?.unit ?? 0]
  const noDecimalSituation = transactionMethod.name === "count" || isRialMode
  const basePrice = selectedProduct?.price ?? 0
  const priceToUnitRatio = selectedProduct?.unitPriceRatio ?? 1
  const minVolume = selectedProduct?.minVoume ?? 0
  const maxVolume = selectedProduct?.maxVoume ?? 0
  const maxDecimalsCount = noDecimalSituation ? 0 : (selectedProduct?.decimalNumber ?? 0)

  const convertedValue = isRialMode
    ? calcOutputWeight(value, basePrice, priceToUnitRatio, maxDecimalsCount)
    : calcOutputRial(value, side === "buy" ? totalBuyPrice : totalSellPrice, priceToUnitRatio)

  const checkAll = () => {
    checkForMaxDecimal()
    checkForMinVolume()
    checkForMaxVolume()
  }

  const checkForMaxDecimal = () => {
    let newStatus: RuleStatus = "empty"

    if (maxDecimalsCount <= 0) {
      newStatus = value === Math.floor(value) ? "success" : "error"
    } else {
      newStatus = value.toString().split(".")?.[1]?.length > maxDecimalsCount ? "error" : "success"
    }

    setNotesStatus(p => ({ ...p, maxDecimal: newStatus }))
  }

  const checkForMinVolume = () => {
    if (minVolume <= 0) return
    const weight = isRialMode ? convertedValue : value

    const newStatus = weight < minVolume ? "error" : "success"
    setNotesStatus(p => ({ ...p, minVolume: newStatus }))
  }

  const checkForMaxVolume = () => {
    if (maxVolume <= 0) return
    const weight = isRialMode ? convertedValue : value

    const newStatus = weight > maxVolume ? "error" : "success"
    setNotesStatus(p => ({ ...p, maxVolume: newStatus }))
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    checkForMaxDecimal()
  }, [maxDecimalsCount, value, isRialMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    checkForMinVolume()
  }, [minVolume, convertedValue, value, isRialMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    checkForMaxVolume()
  }, [maxVolume, convertedValue, value, isRialMode])

  if (!selectedProduct) return null

  return (
    <div className="bg-slate-3 border-s-2 border-slate-7 rounded-md p-2 flex flex-col gap-2 text-xs">
      <div className="text-slate-12 flex gap-1 items-center">
        <WarningCircleIcon size={16} weight="fill" />
        <p>نکات:</p>

        <BtnTemplates.IconReload
          onClick={checkAll}
          className="w-6 min-h-6 p-1 ms-auto"
          iconSize={16}
        />
      </div>

      {maxDecimalsCount <= 0 ? (
        <Rule msg="لطفا اعداد صحیح (غیر اعشاری) وارد کنید" status={notesStatus.maxDecimal} />
      ) : (
        <Rule
          msg={`تا ${formatPersianString(maxDecimalsCount)} عدد اعشار میتوانید وارد کنید!`}
          status={notesStatus.maxDecimal}
        />
      )}

      {minVolume > 0 && (
        <Rule
          msg={`حداقل مقدار ${formatPersianString(minVolume)} ${transactionMethod.unitTitle} است`}
          status={notesStatus.minVolume}
        />
      )}

      {maxVolume > 0 && (
        <Rule
          msg={`حداکثر مقدار ${formatPersianString(maxVolume)} ${transactionMethod.unitTitle} است`}
          status={notesStatus.maxVolume}
        />
      )}
    </div>
  )
}

interface RuleProps {
  msg: string
  status: RuleStatus
}

function Rule({ status, msg }: RuleProps) {
  return (
    <p
      {...ccn("flex gap-1 text-slate-11", {
        "text-red-10": status === "error",
        "text-green-10": status === "success",
      })}
    >
      <span className="flex-1">{msg}</span>

      {status === "empty" && <CircleIcon size={16} />}
      {status === "error" && <XCircleIcon size={16} />}
      {status === "success" && <CheckCircleIcon size={16} />}
    </p>
  )
}

// interface NoteProps {
//   msg: string
// }

// function Note({ msg }: NoteProps) {
//   return (
//     <p className="flex gap-1">
//       <span>- </span>
//       <span className="flex-1">{msg}</span>
//     </p>
//   )
// }
