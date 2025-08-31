import { OrdersTable } from "./OrdersTable"
import { OtherControls } from "./OtherControls"
import { StocksTable } from "./StocksTable"
import { Tabs } from "./Tabs"

export function Tables() {
  return (
    <Tabs
      tab1Title="سفارشات"
      tab1Content={<OrdersTable />}
      tab2Title="خلاصه"
      tab2Content={<StocksTable />}
      btns={<OtherControls />}
    />
  )
}
