import { HeadingLine } from "@repo/shared/layouts"
import ShowIfStoreOnline from "../Products/ShowIfStoreOnline"
import OrderModal from "./OrderModal"
import TradeForm from "./TradeForm"

export default function Trade() {
  return (
    <HeadingLine title="معامله">
      <OrderModal />

      <ShowIfStoreOnline>
        <TradeForm />
      </ShowIfStoreOnline>
    </HeadingLine>
  )
}
