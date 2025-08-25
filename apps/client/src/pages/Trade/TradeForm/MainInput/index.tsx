import { skins } from "@repo/shared/forms"
import { useAtomValue } from "jotai"
import { cx } from "#/shared/cva.config"
import PreviewBar from "./PreviewBar"
import PriceInput, { priceInputErrorMsgAtom } from "./PriceInput"
import RialModeToggle from "./RialModeToggle"
import { ShowCurrentUnit } from "./ShowCurrentUnit"

const inputWrapperStyles = cx(`
  border-b-2 border-slate-7 has-focus:border-brand-9
  flex gap-2 py-2 flex-row-reverse items-center
`)

export function MainInput() {
  return (
    <div className="flex gap-2 flex-col">
      <div className={inputWrapperStyles}>
        <PriceInput />
        <ShowCurrentUnit />
      </div>

      <ErrorMsg />

      <RialModeToggle />

      <PreviewBar />
    </div>
  )
}

function ErrorMsg() {
  const errorMsg = useAtomValue(priceInputErrorMsgAtom)

  return (
    errorMsg && (
      <p dir="auto" className={skins.errorMsg({ className: "text-center" })}>
        {errorMsg}
      </p>
    )
  )
}
