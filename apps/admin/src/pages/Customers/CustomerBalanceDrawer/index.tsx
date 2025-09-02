import { CoinsIcon } from "@phosphor-icons/react"
import type { PortfolioDto } from "@repo/api-client"
import { getApiMasterUserPortfolioByCustomerIdOptions } from "@repo/api-client"
import { DrawerSheet, SmallErrorWithRetryBtn } from "@repo/shared/components"
import { parseError } from "@repo/shared/helpers"
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
  const resCustomers = useQuery(apiGetCustomersOptions)
  const customer = useMemo(
    () => (resCustomers.data ?? []).find(c => c.id === customerId),
    [customerId, resCustomers.data],
  )

  const resBalances = useQuery({
    ...getApiMasterUserPortfolioByCustomerIdOptions({
      path: { CustomerID: customerId },
    }),
    select,
  })

  return (
    <DrawerSheet open onClose={onClose} title="باقیمانده مشتری" icon={CoinsIcon}>
      {resCustomers.isError && (
        <SmallErrorWithRetryBtn
          details={parseError(resCustomers.error)}
          onClick={resCustomers.refetch}
        />
      )}

      {resBalances.isError && (
        <SmallErrorWithRetryBtn
          details={parseError(resBalances.error)}
          onClick={resBalances.refetch}
        />
      )}

      {(resBalances.isPending || resCustomers.isPending) && (
        <div className="h-100 rounded-md animate-pulse bg-slate-4" />
      )}

      {resBalances.isSuccess && customer && <BalanceCards balanceItems={resBalances.data} />}
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
