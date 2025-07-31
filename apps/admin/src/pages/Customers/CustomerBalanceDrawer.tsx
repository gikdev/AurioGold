import { CoinsIcon } from "@phosphor-icons/react"
import type { CustomerDto, PortfolioDto } from "@repo/api-client/client"
import { getApiMasterUserPortfolioByCustomerIdOptions } from "@repo/api-client/tanstack"
import {
  BtnTemplates,
  DrawerSheet,
  EntityNotFoundCard,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { memo } from "react"
import { v4 as uuid } from "uuid"
import { getHeaderTokenOnly } from "#/shared/react-query"
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

const useCustomerBalanceQuery = (customerId: number | null) =>
  useQuery({
    ...getApiMasterUserPortfolioByCustomerIdOptions({
      ...getHeaderTokenOnly(),
      path: { CustomerID: customerId || 0 },
    }),
    enabled: () => typeof customerId === "number",
    select: rawItems => rawItems.map(convertPortfolioItemToBalanceItem),
  })

interface CustomerDetailsProps {
  customers: CustomerDto[]
}

function _CustomerBalanceDrawer({ customers }: CustomerDetailsProps) {
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showBalanceDrawer, setShowBalanceDrawer] = useDrawerSheet(QUERY_KEYS.balance)
  const customer = customers.find(c => c.id === customerId)
  const { data: balance = [] } = useCustomerBalanceQuery(customerId)

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

      {customer && <BalanceCards balanceItems={balance} />}
    </DrawerSheet>
  )
}

const CustomerBalanceDrawer = memo(_CustomerBalanceDrawer)
export default CustomerBalanceDrawer
