import { InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import type { CustomerDto, CustomerGroupIntDto } from "@repo/api-client/client"
import { createTypedTableFa } from "@repo/shared/components"
import { cellRenderers } from "@repo/shared/lib"
import type { ColDef } from "ag-grid-community"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { skins } from "#/shared/forms/skins"
import { groupFormFields } from "../GroupDrawer/stuff"
import { useNumericGroupsStore } from "../shared"

function ManagementBtns({ data: { id } }: { data: CustomerDto }) {
  return (
    <div className="flex items-center gap-1 py-1">
      <button
        type="button"
        className={skins.btn({ intent: "info", size: "small", isIcon: true })}
        onClick={() => {
          if (typeof id !== "number") return
          useNumericGroupsStore.getState().details(id)
        }}
      >
        <InfoIcon />
      </button>

      <button
        type="button"
        className={skins.btn({ intent: "warning", size: "small", isIcon: true })}
        onClick={() => {
          if (typeof id !== "number") return
          useNumericGroupsStore.getState().edit(id)
        }}
      >
        <PencilSimpleIcon />
      </button>

      <button
        type="button"
        className={skins.btn({ intent: "error", size: "small", isIcon: true })}
        onClick={() => {
          if (typeof id !== "number") return
          useNumericGroupsStore.getState().remove(id)
        }}
      >
        <TrashIcon />
      </button>
    </div>
  )
}

const getLabelProperty = generateLabelPropertyGetter(groupFormFields.labels)

const columnDefs: ColDef<CustomerGroupIntDto>[] = [
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

const Table = createTypedTableFa<CustomerGroupIntDto>()

export function GroupsNumericTable({ groups }: { groups: CustomerGroupIntDto[] }) {
  return (
    <div className="h-160">
      <Table columnDefs={columnDefs} rowData={groups} />
    </div>
  )
}
