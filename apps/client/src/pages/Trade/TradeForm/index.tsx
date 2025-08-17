import { BuyAndSellToggleBtn } from "./BuyAndSellToggleBtn"
import { MainInput } from "./MainInput"
import Price from "./Price"
import { SelectProduct } from "./SelectProduct"
import SubmitBtn from "./SubmitBtn"

export function TradeForm() {
  return (
    <div className="flex flex-col gap-8 p-4 bg-slate-2 rounded-md w-full max-w-120 mx-auto">
      <BuyAndSellToggleBtn />
      <SelectProduct />
      <MainInput />

      <div className="flex flex-col gap-2">
        <Price />
        <SubmitBtn />
      </div>
    </div>
  )
}
