import { CheckCircleIcon, CircleIcon, WarningCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { BtnTemplates } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import { formatPersianString } from "@repo/shared/utils"
import { atom, useAtom } from "jotai"
import { useEffect } from "react"
import {
  useFinalProductPrices,
  useProductId,
  useProductSide,
  useStockByIdQuery,
  useTradeFormStore,
} from "../shared"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./shared"
import { useProductContext } from "../ProductFetcher"

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
  const product = useProductContext()
  const [notesStatus, setNotesStatus] = useAtom(notesStatusAtom)
  const [side] = useProductSide()
  const currentValue = useTradeFormStore(s => s.currentValue)
  const isRialMode = useTradeFormStore(s => s.rial)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices()

  const transactionMethod = transactionMethods[product?.unit ?? 0]
  const noDecimalSituation = transactionMethod.name === "count" || isRialMode
  const priceToUnitRatio = product?.unitPriceRatio ?? 1
  const minVolume = product?.minVoume ?? 0
  const maxVolume = product?.maxVoume ?? 0
  const maxDecimalsCount = noDecimalSituation ? 0 : (product?.decimalNumber ?? 0)

  const convertedValue = isRialMode
    ? calcOutputWeight(
        currentValue,
        side === "buy" ? totalBuyPrice : totalSellPrice,
        priceToUnitRatio,
        maxDecimalsCount,
      )
    : calcOutputRial(
        currentValue,
        side === "buy" ? totalBuyPrice : totalSellPrice,
        priceToUnitRatio,
      )

  const checkAll = () => {
    checkForMaxDecimal()
    checkForMinVolume()
    checkForMaxVolume()
  }

  const checkForMaxDecimal = () => {
    let newStatus: RuleStatus = "empty"

    if (maxDecimalsCount <= 0) {
      newStatus = currentValue === Math.floor(currentValue) ? "success" : "error"
    } else {
      newStatus =
        currentValue.toString().split(".")?.[1]?.length > maxDecimalsCount ? "error" : "success"
    }

    setNotesStatus(p => ({ ...p, maxDecimal: newStatus }))
  }

  const checkForMinVolume = () => {
    if (minVolume <= 0) return
    const weight = isRialMode ? convertedValue : currentValue

    const newStatus = weight < minVolume ? "error" : "success"
    setNotesStatus(p => ({ ...p, minVolume: newStatus }))
  }

  const checkForMaxVolume = () => {
    if (maxVolume <= 0) return
    const weight = isRialMode ? convertedValue : currentValue

    const newStatus = weight > maxVolume ? "error" : "success"
    setNotesStatus(p => ({ ...p, maxVolume: newStatus }))
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    checkForMaxDecimal()
  }, [maxDecimalsCount, currentValue, isRialMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    checkForMinVolume()
  }, [minVolume, convertedValue, currentValue, isRialMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    checkForMaxVolume()
  }, [maxVolume, convertedValue, currentValue, isRialMode])

  if (!product) return null

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
