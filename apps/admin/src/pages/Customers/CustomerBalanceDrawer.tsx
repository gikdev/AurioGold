import { useApiRequest } from "@gikdev/react-datapi/src"
import { CoinsIcon } from "@phosphor-icons/react"
import type { PortfolioDto } from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { useAtomValue } from "jotai"
import { memo } from "react"
import { v4 as uuid } from "uuid"
import { EntityNotFoundCard } from "#/components"
import { customersAtom } from "."
import BalanceCards from "./BalanceCards"
import { QUERY_KEYS } from "./navigation"

export interface UserBalanceItemWithId {
  id: string
  stockId: NonNullable<PortfolioDto["tyStockID"]>
  stockName: NonNullable<PortfolioDto["stockName"]>
  volume: NonNullable<PortfolioDto["volume"]>
  customerId: NonNullable<PortfolioDto["customerID"]>
  customerName: NonNullable<PortfolioDto["customerName"]>
}

function convertPortfolioItemToBalanceItem(obj: PortfolioDto): UserBalanceItemWithId {
  return {
    customerId: obj.customerID ?? 0,
    customerName: obj.customerName ?? "---",
    id: uuid(),
    stockName: obj.stockName ?? "---",
    stockId: obj.tyStockID ?? 0,
    volume: obj.volume ?? 0,
  }
}

// interface CustomerDetailsProps {}

function _CustomerBalanceDrawer(
  // {}: CustomerDetailsProps
) {
  const customers = useAtomValue(customersAtom)
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showBalanceDrawer, setShowBalanceDrawer] = useDrawerSheet(QUERY_KEYS.balance)
  const customer = customers.find(c => c.id === customerId)
  const resBalance = useApiRequest<UserBalanceItemWithId[], PortfolioDto[]>(() => ({
    url: `/Master/UserPortfolio/${customerId}`,
    dependencies: [customerId],
    defaultValue: [],
    transformResponse: rawItems => rawItems.map(convertPortfolioItemToBalanceItem),
    shouldRun: () => !!customerId,
  }))

  const handleClose = () => {
    setShowBalanceDrawer(false)
    setCustomerId(null)
  }

  const btns = (
    <>
      <BtnTemplates.Cancel onClick={handleClose} />
    </>
  )

  return (
    <DrawerSheet
      onClose={handleClose}
      open={customerId !== null && showBalanceDrawer}
      title="باقیمانده مشتری"
      icon={CoinsIcon}
      btns={btns}
    >
      {customer === undefined && <EntityNotFoundCard entity="مشتری" />}

      {customer && <BalanceCards balanceItems={resBalance.data ?? []} />}
    </DrawerSheet>
  )
}

const CustomerBalanceDrawer = memo(_CustomerBalanceDrawer)
export default CustomerBalanceDrawer
