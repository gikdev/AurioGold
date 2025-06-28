import styled from "@master/styled.react"
import { useBooleanishQueryState } from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import { QUERY_KEYS } from "../../navigation"
import { selectedProductAtom } from "../shared"
import Notes from "./Notes"
import PreviewBar from "./PreviewBar"
import PriceInput from "./PriceInput"
import RialModeToggle from "./RialModeToggle"
import { transactionMethods } from "./shared"

const StyledInputWrapper = styled.div`
  border-b-2 border-slate-7 has-focus:border-brand-9
  flex gap-2 py-2 flex-row-reverse items-center
`

export default function MainInput() {
  return (
    <div className="flex gap-2 flex-col">
      <StyledInputWrapper>
        <PriceInput />
        <ShowCurrentUnit />
      </StyledInputWrapper>

      <RialModeToggle />

      <PreviewBar />

      <Notes />
    </div>
  )
}

function ShowCurrentUnit() {
  const [isRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const transactionMethod = transactionMethods[selectedProduct?.unit ?? 0]
  const currentUnit = isRialMode ? "ریال" : transactionMethod.unitTitle

  return (
    <p className="leading-none max-w-max max-h-max border-e pe-2 border-slate-6">{currentUnit}</p>
  )
}
