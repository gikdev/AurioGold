import { useApiRequest } from "@gikdev/react-datapi/src"
import { ArrowClockwiseIcon, CirclesThreePlusIcon, UsersThreeIcon } from "@phosphor-icons/react"
import type { CustomerDto, CustomerGroupDto } from "@repo/api-client/client"
import {
  Btn,
  BtnTemplates,
  FloatingActionBtn,
  TitledCard,
  createTypedTableFa,
  useViewModes,
} from "@repo/shared/components"
import { getIsMobile } from "@repo/shared/hooks"
import { cellRenderers } from "@repo/shared/lib"
import type { ColDef } from "ag-grid-community"
import { Link } from "react-router"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { queryStateUrls } from "."
import CreateGroupDrawer from "./CreateGroupDrawer"
import DeleteGroupModal from "./DeleteGroupModal"
import EditGroupDrawer from "./EditGroupDrawer"
import { GroupCard, GroupCardsContainer } from "./GroupCard"
import GroupDetails from "./GroupDetails"
import { groupFormFields } from "./groupFormShared"

export default function ManageGroupsGram() {
  const isMobile = getIsMobile()
  const { renderedIconsToggle, viewMode } = useViewModes()
  const groupsRes = useApiRequest<CustomerGroupDto[]>(() => ({
    url: "/TyCustomerGroups",
    defaultValue: [],
  }))

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      <Btn className="h-10 w-10 p-1" onClick={() => groupsRes.reload()}>
        <ArrowClockwiseIcon size={24} />
      </Btn>

      <CreateGroupFAB />
      {renderedIconsToggle}
    </div>
  )

  return (
    <>
      <DeleteGroupModal reloadGroups={() => groupsRes.reload()} />
      <CreateGroupDrawer reloadGroups={() => groupsRes.reload()} />
      <EditGroupDrawer reloadGroups={() => groupsRes.reload()} groups={groupsRes.data ?? []} />
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
                id={g.id ?? 0}
                diffBuyPrice={g.diffBuyPrice ?? 0}
                diffSellPrice={g.diffSellPrice ?? 0}
                name={g.name ?? "---"}
                details={queryStateUrls.details}
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
      theme="success"
      fallback={
        <Btn
          type="button"
          className="h-10 w-10 text-xs px-0"
          theme="success"
          title="ایجاد گروه جدید"
          as={Link}
          to={queryStateUrls.createNew()}
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
      <BtnTemplates.IconInfo
        as={Link}
        to={queryStateUrls.details(id!)}
        className="min-h-8 w-8 p-1"
      />
      <BtnTemplates.IconEdit as={Link} to={queryStateUrls.edit(id!)} className="min-h-8 w-8 p-1" />
      <BtnTemplates.IconDelete
        as={Link}
        to={queryStateUrls.delete(id!)}
        className="min-h-8 w-8 p-1"
      />
    </div>
  )
}

const getLabelProperty = generateLabelPropertyGetter(groupFormFields.labels)

const columnDefs: ColDef<CustomerGroupDto>[] = [
  { headerName: "مدیریت", cellRenderer: ManagementBtns },
  { field: "name", headerName: getLabelProperty("name") },
  { field: "description", headerName: getLabelProperty("description"), minWidth: 200 },
  {
    field: "diffBuyPrice",
    headerName: getLabelProperty("diffBuyPrice"),
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "diffSellPrice",
    headerName: getLabelProperty("diffSellPrice"),
    cellRenderer: cellRenderers.PersianComma,
  },
  { field: "id", headerName: "آی‌دی" },
]

const Table = createTypedTableFa<CustomerGroupDto>()

function GroupsGramTable({ groupsGram }: { groupsGram: CustomerGroupDto[] }) {
  return (
    <div className="h-160">
      <Table columnDefs={columnDefs} rowData={groupsGram} />
    </div>
  )
}
