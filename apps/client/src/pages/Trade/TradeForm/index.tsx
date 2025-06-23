import styled from "@master/styled.react"
import BuyAndSellToggleBtn from "./BuyAndSellToggleBtn"
import MainInput from "./MainInput"
import Price from "./Price"
import SelectProduct from "./SelectProduct"
import SubmitBtn from "./SubmitBtn"

const StyledForm = styled.form`
  flex flex-col gap-8 p-4 bg-slate-2
  rounded-md w-full max-w-120 mx-auto
`

export default function TradeForm() {
  const onSubmit = () => {}

  return (
    <StyledForm onSubmit={onSubmit}>
      <BuyAndSellToggleBtn />
      <SelectProduct />
      <MainInput />

      <div className="flex flex-col gap-2">
        <Price />
        <SubmitBtn />
      </div>
    </StyledForm>
  )
}
