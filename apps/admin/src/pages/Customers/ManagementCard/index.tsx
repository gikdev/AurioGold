import { ArrowClockwiseIcon, UserCirclePlusIcon, UsersThreeIcon } from "@phosphor-icons/react"
import { getApiMasterGetCustomersOptions } from "@repo/api-client/tanstack"
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
import { queryClient } from "#/shared"
import { apiGetCustomersOptions } from "../shared"
import { useCustomersStore } from "../store"
import { CustomerCards } from "./CustomerCards"
import { CustomersTable } from "./CustomersTable"

export function ManagementCard() {
  const {
    data: customers = [],
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery(apiGetCustomersOptions)
  const viewMode = useCurrentViewMode()

  return (
    <TitledCard
      title="مدیریت مشتریان"
      icon={UsersThreeIcon}
      titleSlot={<TitledCardActions />}
      className="md:max-w-240"
    >
      {isError && <SmallErrorWithRetryBtn details={parseError(error)} onClick={refetch} />}
      {isPending && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}
      {isSuccess && viewMode === "table" && <CustomersTable customers={customers} />}
      {isSuccess && viewMode === "cards" && <CustomerCards customers={customers} />}
    </TitledCard>
  )
}

const TitledCardActions = () => (
  <div className="ms-auto flex items-center gap-2">
    <ReloadCustomersBtn />
    <CreateCustomerBtn />
    <ViewModesToggle />
  </div>
)

const ReloadCustomersBtn = () => (
  <button type="button" className={skins.btn({ isIcon: true })} onClick={refetchCustomers}>
    <ArrowClockwiseIcon />
  </button>
)

const refetchCustomers = () =>
  queryClient.refetchQueries(getApiMasterGetCustomersOptions(getHeaderTokenOnly()))

const CreateCustomerBtn = () => {
  return (
    <button
      type="button"
      title="ایجاد مشتری جدید"
      className={skins.btn({ isIcon: true, intent: "success" })}
      onClick={openCreateCustomerDrawer}
    >
      <UserCirclePlusIcon size={24} className="transition-all" />
    </button>
  )
}

const openCreateCustomerDrawer = () => useCustomersStore.getState().createNew()
