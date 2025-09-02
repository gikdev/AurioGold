import { CoinsIcon, InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client"
import { createTypedTableFa } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { cellRenderers } from "@repo/shared/lib"
import type { ColDef } from "ag-grid-community"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { customerFormFields } from "../CustomerDrawer/stuff"
import { useCustomersStore } from "../store"

export function CustomersTable({ customers }: { customers: CustomerDto[] }) {
  return (
    <div className="flex-1 min-h-80">
      <Table columnDefs={columnDefs} rowData={customers} />
    </div>
  )
}

const Table = createTypedTableFa<CustomerDto>()

const getLabelProperty = generateLabelPropertyGetter(customerFormFields.labels)

const columnDefs: ColDef<CustomerDto>[] = [
  { headerName: "مدیریت", cellRenderer: ManagementBtns, minWidth: 200 },
  { field: "groupName", headerName: getLabelProperty("gramGroupId") },
  { field: "groupIntName", headerName: getLabelProperty("numericGroupId") },
  { field: "displayName", headerName: getLabelProperty("displayName") },
  { field: "mobile", headerName: getLabelProperty("phone"), cellRenderer: cellRenderers.Ltr },
  {
    field: "codeMelli",
    headerName: getLabelProperty("nationalId"),
    cellRenderer: cellRenderers.Ltr,
  },
  {
    field: "isActive",
    headerName: getLabelProperty("isActive"),
    cellRenderer: cellRenderers.TrueFalse,
  },
  {
    field: "isBlocked",
    headerName: getLabelProperty("isBlocked"),
    cellRenderer: cellRenderers.TrueFalse,
  },
  {
    field: "allowedDevices",
    headerName: getLabelProperty("maxAllowedDevices"),
    cellRenderer: cellRenderers.Ltr,
    minWidth: 240,
  },
  { field: "id", headerName: "آی‌دی", cellRenderer: cellRenderers.Ltr },
]

function ManagementBtns({ data: { id } }: { data: CustomerDto }) {
  if (typeof id !== "number") return "---"

  return (
    <div className="flex items-center gap-1 py-1">
      {/* Customer Balance Btn */}
      <button
        type="button"
        className={skins.btn({ size: "small", isIcon: true, intent: "info" })}
        onClick={() => useCustomersStore.getState().balance(id)}
      >
        <CoinsIcon />
      </button>

      {/* Customer Details Btn */}
      <button
        type="button"
        className={skins.btn({ size: "small", isIcon: true, intent: "info" })}
        onClick={() => useCustomersStore.getState().details(id)}
      >
        <InfoIcon />
      </button>

      {/* Edit Customer Btn */}
      <button
        type="button"
        className={skins.btn({ size: "small", isIcon: true, intent: "warning" })}
        onClick={() => useCustomersStore.getState().edit(id)}
      >
        <PencilSimpleIcon />
      </button>

      {/* Delete Customer Btn */}
      <button
        type="button"
        className={skins.btn({ size: "small", isIcon: true, intent: "error" })}
        onClick={() => useCustomersStore.getState().delete(id)}
      >
        <TrashIcon />
      </button>
    </div>
  )
}
