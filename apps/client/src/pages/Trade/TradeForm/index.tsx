import type { StockDto } from "@repo/api-client/client"
import { ccn } from "@repo/shared/helpers"
import { atom } from "jotai"
import BuyAndSellToggleBtn from "./BuyAndSellToggleBtn"
import MainInput from "./MainInput"
import Price from "./Price"
import SelectProduct from "./SelectProduct"
import SubmitBtn from "./SubmitBtn"

export const selectedProductAtom = atom<Required<StockDto> | null>(null)

export default function TradeForm() {
  const onSubmit = () => {}

  return (
    <form {...styles.form} onSubmit={onSubmit}>
      <BuyAndSellToggleBtn />
      <SelectProduct />
      <MainInput />
      <Price />
      <SubmitBtn />
    </form>
  )
}
const styles = {
  form: ccn(`
    flex flex-col gap-5 p-5 bg-slate-2
    rounded-md w-full max-w-120 mx-auto
  `),
}
