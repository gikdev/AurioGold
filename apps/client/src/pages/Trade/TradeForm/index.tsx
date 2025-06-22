import type { StockDto } from "@repo/api-client/client"
import { Input, Labeler } from "@repo/shared/components"
import { useLiteralQueryState } from "@repo/shared/hooks"
import { atom } from "jotai"
import { QUERY_KEYS } from "../navigation"
import BuyAndSellToggleBtn, { sides } from "./BuyAndSellToggleBtn"
import SelectProduct from "./SelectProduct"
import SubmitBtn from "./SubmitBtn"

export const selectedProductAtom = atom<Required<StockDto> | null>(null)

export default function TradeForm() {
  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)

  const onSubmit = () => {}

  return (
    <form className="flex flex-col gap-5 p-5 bg-slate-2 rounded-md" onSubmit={onSubmit}>
      <BuyAndSellToggleBtn />

      <SelectProduct />

      <Labeler labelText={side === "buy" ? "پرداخت میکنم:" : "می‌فروشم:"}>
        <Input dir="ltr" type="number" defaultValue={0} />
      </Labeler>

      <Labeler labelText="دریافت می‌کنم:">
        <Input dir="ltr" type="number" defaultValue={0} />
      </Labeler>

      <SubmitBtn />
    </form>
  )
}
