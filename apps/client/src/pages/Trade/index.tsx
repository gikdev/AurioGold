import { HeadingLine } from "@repo/shared/layouts"
import ShowIfStoreOnline from "../Products/ShowIfStoreOnline"
import TradeForm from "./TradeForm"

export default function Trade() {
  return (
    <HeadingLine title="معامله">
      <ShowIfStoreOnline>
        <TradeForm />
      </ShowIfStoreOnline>
    </HeadingLine>
  )
}
