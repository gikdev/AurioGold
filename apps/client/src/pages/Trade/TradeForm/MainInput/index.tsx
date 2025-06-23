import styled from "@master/styled.react"
import Msgs from "./Msgs"
import PreviewBar from "./PreviewBar"
import PriceInput from "./PriceInput"
import RialModeToggle from "./RialModeToggle"

const StyledInputWrapper = styled.div`
  border-b-2 border-slate-7 has-focus:border-brand-9
  flex gap-2 py-2 flex-row-reverse 
`

export default function MainInput() {
  return (
    <div className="flex gap-2 flex-col">
      <StyledInputWrapper>
        <PriceInput />

        <RialModeToggle />
      </StyledInputWrapper>

      <PreviewBar />

      <Msgs />
    </div>
  )
}
