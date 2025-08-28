import { CoinsIcon } from "@phosphor-icons/react"
import type { PortfolioDto } from "@repo/api-client/client"
import { getApiMasterUserPortfolioByCustomerIdOptions } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { DrawerSheet, EntityNotFoundCard } from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { v4 as uuid } from "uuid"
import { apiGetCustomersOptions } from "../shared"
import type { CustomerId } from "../store"
import BalanceCards from "./BalanceCards"

interface CustomerBalanceDrawerProps {
  customerId: CustomerId
  onClose: () => void
}

export function CustomerBalanceDrawer({ customerId, onClose }: CustomerBalanceDrawerProps) {
  const { data: customers = [] } = useQuery(apiGetCustomersOptions)
  const customer = useMemo(() => customers.find(c => c.id === customerId), [customerId, customers])

  const { data: balances = [] } = useQuery({
    ...getApiMasterUserPortfolioByCustomerIdOptions({
      ...getHeaderTokenOnly(),
      path: { CustomerID: customerId },
    }),
    select,
  })

  return (
    <DrawerSheet open onClose={onClose} title="باقیمانده مشتری" icon={CoinsIcon}>
      {customer ? <BalanceCards balanceItems={balances} /> : <EntityNotFoundCard entity="مشتری" />}
    </DrawerSheet>
  )
}

const select = (items: PortfolioDto[]) => items.map(convertPortfolioItemToBalanceItem)

function convertPortfolioItemToBalanceItem(obj: PortfolioDto): UserBalanceItemWithId {
  return {
    id: uuid(),
    customerId: obj.customerID ?? 0,
    customerName: obj.customerName ?? "---",
    stockName: obj.stockName ?? "---",
    stockId: obj.tyStockID ?? 0,
    volume: obj.volume ?? 0,
  }
}

export interface UserBalanceItemWithId {
  id: string
  stockId: NonNullable<PortfolioDto["tyStockID"]>
  stockName: NonNullable<PortfolioDto["stockName"]>
  volume: NonNullable<PortfolioDto["volume"]>
  customerId: NonNullable<PortfolioDto["customerID"]>
  customerName: NonNullable<PortfolioDto["customerName"]>
}
