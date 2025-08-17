import { HeadingLine } from "@repo/shared/layouts"
import ShowIfStoreOnline from "../Products/ShowIfStoreOnline"
import { OrderModal } from "./OrderModal"
import { TradeForm } from "./TradeForm"

export default function Trade() {
  const showOrderModal = OrderModal.useShouldBeOpen()

  return (
    <HeadingLine title="معامله">
      {showOrderModal && <OrderModal />}

      <ShowIfStoreOnline>
        <TradeForm />
      </ShowIfStoreOnline>
    </HeadingLine>
  )
}
