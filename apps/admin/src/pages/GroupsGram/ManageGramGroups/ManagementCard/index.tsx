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
import { gramGroupsOptions, useGramGroupsStore } from "../shared"
import { GroupsGramTable } from "./GramGroupsTable"
import { GroupCards } from "./GroupCards"

export function ManagementCard() {
  const viewMode = useCurrentViewMode()
  const {
    data: groups = [],
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery(gramGroupsOptions)

  return (
    <TitledCard
      title="مدیریت گروه گرمی"
      icon={UsersThreeIcon}
      titleSlot={<TitledCardActions />}
      className="md:max-w-240 flex flex-col flex-1"
    >
      {isError && <SmallErrorWithRetryBtn details={parseError(error)} onClick={() => refetch()} />}
      {isPending && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}
      {isSuccess && viewMode === "cards" && <GroupCards groups={groups} />}
      {isSuccess && viewMode === "table" && <GroupsGramTable groups={groups} />}
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
      onClick={() => queryClient.refetchQueries(gramGroupsOptions)}
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
    onClick={() => useGramGroupsStore.getState().createNew()}
  >
    <CirclesThreePlusIcon />
  </button>
)
