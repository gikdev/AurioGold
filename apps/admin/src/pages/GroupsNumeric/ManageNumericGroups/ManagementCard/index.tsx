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
import { numericGroupsOptions, useNumericGroupsStore } from "../shared"
import { GroupCards } from "./GroupCards"
import { GroupsNumericTable } from "./NumericGroupsTable"

export function ManagementCard() {
  const viewMode = useCurrentViewMode()
  const {
    data: groups = [],
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery(numericGroupsOptions)

  return (
    <TitledCard
      title="مدیریت گروه عددی"
      icon={UsersThreeIcon}
      titleSlot={<TitledCardActions />}
      className="md:max-w-240 flex flex-col flex-1"
    >
      {isError && <SmallErrorWithRetryBtn details={parseError(error)} onClick={() => refetch()} />}
      {isPending && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}
      {isSuccess && viewMode === "cards" && <GroupCards groups={groups} />}
      {isSuccess && viewMode === "table" && <GroupsNumericTable groups={groups} />}
    </TitledCard>
  )
}

const TitledCardActions = () => (
  <div className="ms-auto flex items-center gap-2">
    <ReloadGramGroupsBtn />
    <CreateGroupBtn />
    <ViewModesToggle />
  </div>
)

function ReloadGramGroupsBtn() {
  const queryClient = useQueryClient()

  return (
    <button
      type="button"
      className={skins.btn({ isIcon: true })}
      onClick={() => queryClient.refetchQueries(numericGroupsOptions)}
    >
      <ArrowClockwiseIcon />
    </button>
  )
}

const CreateGroupBtn = () => (
  <button
    type="button"
    title="ایجاد گروه جدید"
    className={skins.btn({ intent: "success", isIcon: true })}
    onClick={() => useNumericGroupsStore.getState().createNew()}
  >
    <CirclesThreePlusIcon />
  </button>
)
