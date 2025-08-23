import { BuyAndSellToggleBtn } from "./BuyAndSellToggleBtn"
import { HandleValidProductId } from "./HandleValidProductId"
import { MainInput } from "./MainInput"
import Price from "./Price"
import { ProductFetcher } from "./ProductFetcher"
import { SelectedProduct } from "./SelectedProduct"
import SubmitBtn from "./SubmitBtn"

export function TradeForm() {
  return (
    <HandleValidProductId>
      <ProductFetcher>
        <TradeFormCore />
      </ProductFetcher>
    </HandleValidProductId>
  )
}

function TradeFormCore() {
  return (
    <div className="flex flex-col gap-8 p-4 bg-slate-2 rounded-md w-full max-w-120 mx-auto">
      <BuyAndSellToggleBtn />
      <SelectedProduct />
      <MainInput />

      <div className="flex flex-col gap-2">
        <Price />
        <SubmitBtn />
      </div>
    </div>
  )
}
