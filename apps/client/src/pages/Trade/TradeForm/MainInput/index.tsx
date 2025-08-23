import { cx } from "#/shared/cva.config"
import Notes from "./Notes"
import PreviewBar from "./PreviewBar"
import PriceInput from "./PriceInput"
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

      <RialModeToggle />

      <PreviewBar />

      {/* WHERE I LEFT OFF */}
      {/* Go fix whatever red, and note that TradeFormStore has changed! */}
      {/* <Notes /> */}
    </div>
  )
}
