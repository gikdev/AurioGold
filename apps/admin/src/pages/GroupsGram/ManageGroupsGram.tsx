import { useApiRequest } from "@gikdev/react-datapi/src"
import {
  ArrowCounterClockwiseIcon,
  CardsIcon,
  CirclesThreePlusIcon,
  InfoIcon,
  PenIcon,
  TableIcon,
  TrashIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"
import type { CustomerDto, CustomerGroupDto } from "@repo/api-client/client"
import {
  Btn,
  FloatingActionBtn,
  IconsToggle,
  TableFa,
  TitledCard,
  createViewModes,
} from "@repo/shared/components"
import { useIsMobile } from "@repo/shared/hooks"
import type { ColDef } from "ag-grid-community"
import { useState } from "react"
import { Link } from "react-router"
import { queryStateUrls } from "."
import { GroupCard, GroupCardsContainer } from "./GroupCard"
import GroupDetails from "./GroupDetails"
import DeleteGroupModal from "./DeleteGroupModal"

const viewModeSetup = createViewModes([
  { id: "cards", icon: CardsIcon },
  { id: "table", icon: TableIcon },
])
type ViewModes = typeof viewModeSetup.type
const viewModes = viewModeSetup.items

export default function ManageGroupsGram() {
  const isMobile = useIsMobile()
  const [viewMode, setMode] = useState<ViewModes>("cards")
  const groupsRes = useApiRequest<CustomerGroupDto[]>(() => ({
    url: "/TyCustomerGroups",
    defaultValue: [],
  }))

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      <Btn className="h-10 w-10 p-1" onClick={() => groupsRes.reload()}>
        <ArrowCounterClockwiseIcon size={24} />
      </Btn>

      <CreateGroupFAB />
      <IconsToggle items={viewModes} activeItemId={viewMode} onChange={setMode} />
    </div>
  )

  return (
    <>
      <DeleteGroupModal reloadGroups={() => groupsRes.reload()} />
      {/* <CreateGroupDrawer reloadGroups={() => groupsRes.reload()} /> */}
      {/* <EditGroupDrawer reloadGroups={() => groupsRes.reload()} groups={groupsRes.data ?? []} /> */}
      <GroupDetails groups={groupsRes.data ?? []} />

      <TitledCard
        title="مدیریت گروه گرمی"
        icon={UsersThreeIcon}
        titleSlot={titledCardActions}
        className={!isMobile && viewMode === "table" ? "max-w-240" : undefined}
      >
        {groupsRes.loading && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}

        {groupsRes.success && !groupsRes.loading && viewMode === "cards" && (
          <GroupCardsContainer>
            {(groupsRes.data || []).map(g => (
              <GroupCard
                key={g.id}
                id={g.id}
                diffBuyPrice={g.diffBuyPrice}
                diffSellPrice={g.diffSellPrice}
                name={g.name}
              />
            ))}
          </GroupCardsContainer>
        )}

        {groupsRes.success && !groupsRes.loading && viewMode === "table" && (
          <GroupsGramTable groupsGram={groupsRes.data || []} />
        )}
      </TitledCard>
    </>
  )
}

function CreateGroupFAB() {
  return (
    <FloatingActionBtn
      title="ایجاد گروه جدید"
      icon={CirclesThreePlusIcon}
      to={queryStateUrls.createNew()}
      data-testid="create-customer-btn"
      theme="success"
      fallback={
        <Btn
          type="button"
          className="h-10 w-10 text-xs px-0"
          theme="success"
          title="ایجاد گروه جدید"
          as={Link}
          to={queryStateUrls.createNew()}
          data-testid="create-customer-btn"
        >
          <CirclesThreePlusIcon size={24} className="transition-all" />
        </Btn>
      }
    />
  )
}

function ManagementBtns({ data: { id } }: { data: CustomerDto }) {
  return (
    <div className="flex items-center gap-1 py-1">
      <Btn as={Link} to={queryStateUrls.details(id)} className="h-8 w-8 p-1" theme="info">
        <InfoIcon size={20} />
      </Btn>

      <Btn as={Link} to={queryStateUrls.edit(id)} className="h-8 w-8 p-1" theme="warning">
        <PenIcon size={20} />
      </Btn>

      <Btn as={Link} to={queryStateUrls.delete(id)} className="h-8 w-8 p-1" theme="error">
        <TrashIcon size={20} />
      </Btn>
    </div>
  )
}

const columnDefs: ColDef[] = [
  { headerName: "مدیریت", cellRenderer: ManagementBtns },
  { field: "name", headerName: "نام" },
  { field: "description", headerName: "توضیح" },
  { field: "diffBuyPrice", headerName: "اختلاف خرید مشتری" },
  { field: "diffSellPrice", headerName: "اختلاف فروش مشتری" },
  { field: "id", headerName: "آیدی" },
]

function GroupsGramTable({ groupsGram }: { groupsGram: CustomerGroupDto[] }) {
  return (
    <div className="h-160">
      <TableFa columnDefs={columnDefs} rowData={groupsGram} />
    </div>
  )
}
