import { ArrowClockwiseIcon, CirclesThreePlusIcon, UsersThreeIcon } from "@phosphor-icons/react"
import {
  SmallErrorWithRetryBtn,
  TitledCard,
  useCurrentViewMode,
  ViewModesToggle,
} from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { parseError } from "@repo/shared/helpers"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { priceSourcesOptions, usePriceSourcesStore } from "../shared"
import { PriceSourceCards } from "./PriceSourceCards"
import { PriceSourcesTable } from "./PriceSourcesTable"

export function ManagementCard() {
  const viewMode = useCurrentViewMode()
  const {
    data: sources = [],
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery(priceSourcesOptions)

  return (
    <TitledCard
      title="مدیریت منابع قیمت"
      icon={UsersThreeIcon}
      titleSlot={<TitledCardActions />}
      className="md:max-w-240 flex flex-col flex-1"
    >
      {isError && <SmallErrorWithRetryBtn details={parseError(error)} onClick={() => refetch()} />}
      {isPending && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}
      {isSuccess && viewMode === "cards" && <PriceSourceCards sources={sources} />}
      {isSuccess && viewMode === "table" && <PriceSourcesTable priceSources={sources} />}
    </TitledCard>
  )
}

const TitledCardActions = () => (
  <div className="ms-auto flex items-center gap-2">
    <ReloadPriceSourcesBtn />
    <CreatePriceSourceFAB />
    <ViewModesToggle />
  </div>
)

function ReloadPriceSourcesBtn() {
  const queryClient = useQueryClient()

  const handleClick = () => queryClient.refetchQueries(priceSourcesOptions)

  return (
    <button type="button" className={skins.btn({ isIcon: true })} onClick={handleClick}>
      <ArrowClockwiseIcon />
    </button>
  )
}

const CreatePriceSourceFAB = () => (
  <button
    type="button"
    title="ایجاد منبع جدید"
    onClick={() => usePriceSourcesStore.getState().createNew()}
    className={skins.btn({ intent: "success", isIcon: true })}
  >
    <CirclesThreePlusIcon />
  </button>
)
