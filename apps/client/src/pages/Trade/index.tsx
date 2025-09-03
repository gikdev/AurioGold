import { HeadingLine } from "@repo/shared/layouts"
import ShowIfStoreOnline from "../Products/ShowIfStoreOnline"
import { OrderModal } from "./OrderModal"
import { useIsOrderModalOpen } from "./OrderModal/store"
import { TradeForm } from "./TradeForm"

export default function Trade() {
  const isOrderModalOpen = useIsOrderModalOpen()

  return (
    <HeadingLine title="معامله">
      {isOrderModalOpen && <OrderModal />}

      <ShowIfStoreOnline>
        <TradeForm />
      </ShowIfStoreOnline>
    </HeadingLine>
  )
}
