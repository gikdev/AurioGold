import { ArrowClockwiseIcon, CoinsIcon } from "@phosphor-icons/react"
import type { MasterPortfolioDto } from "@repo/api-client/client"
import { getApiMasterGetMasterPortfolioOptions } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import {
  SmallErrorWithRetryBtn,
  TitledCard,
  useCurrentViewMode,
  ViewModesToggle,
} from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { parseError } from "@repo/shared/helpers"
import { useQuery } from "@tanstack/react-query"
import { v4 as uuid } from "uuid"
import BalanceTable from "./BalanceTable"
import PortfolioCards from "./PortfolioCards"

export interface MasterPortfolioWithId extends MasterPortfolioDto {
  id: string
}

function addIds(items: MasterPortfolioDto[]): MasterPortfolioWithId[] {
  return items.map(i => ({ ...i, id: uuid() }))
}

export const useMasterBalanceQuery = () =>
  useQuery({
    ...getApiMasterGetMasterPortfolioOptions(getHeaderTokenOnly("admin")),
    select: addIds,
  })

export default function ManageBalance() {
  const viewMode = useCurrentViewMode()
  const {
    data: balance = [],
    isPending,
    isSuccess,
    refetch,
    isError,
    error,
  } = useMasterBalanceQuery()

  return (
    <TitledCard
      title="مدیریت مانده حساب"
      icon={CoinsIcon}
      titleSlot={<TitledCardActions />}
      className="flex flex-col flex-1"
    >
      {isError && <SmallErrorWithRetryBtn onClick={refetch} details={parseError(error)} />}
      {isPending && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}
      {isSuccess && viewMode === "cards" && <PortfolioCards portfolios={balance} />}
      {isSuccess && viewMode === "table" && <BalanceTable portfolios={balance} />}
    </TitledCard>
  )
}

const TitledCardActions = () => (
  <div className="ms-auto flex items-center gap-2">
    <ReloadBtn />
    <ViewModesToggle />
  </div>
)

function ReloadBtn() {
  const { refetch } = useMasterBalanceQuery()

  return (
    <button type="button" onClick={() => refetch()} className={skins.btn({ isIcon: true })}>
      <ArrowClockwiseIcon />
    </button>
  )
}
