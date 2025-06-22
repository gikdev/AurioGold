import type { StockDto } from "@repo/api-client/client"
import { Input, Labeler } from "@repo/shared/components"
import { useLiteralQueryState } from "@repo/shared/hooks"
import { atom } from "jotai"
import BuyAndSellToggleBtn, { sides } from "./BuyAndSellToggleBtn"
import SelectProduct from "./SelectProduct"
import SubmitBtn from "./SubmitBtn"

export const selectedProductAtom = atom<Required<StockDto> | null>(null)

export default function TradeForm() {
  const [side] = useLiteralQueryState("side", sides)

  const onSubmit = () => {}

  return (
    <form className="flex flex-col gap-5 p-5 bg-slate-2 rounded-md" onSubmit={onSubmit}>
      <BuyAndSellToggleBtn />

      <Labeler labelText="محصول:">
        <SelectProduct />
      </Labeler>

      <Labeler labelText={side === "buy" ? "پرداخت میکنم" : "می‌فروشم"}>
        <Input type="number" />
      </Labeler>

      <Labeler labelText="دریافت می‌کنم">
        <Input type="number" />
      </Labeler>

      <SubmitBtn />
    </form>
  )
}
