import { InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import { createTypedTableFa } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { cellRenderers } from "@repo/shared/lib"
import type { ColDef } from "ag-grid-community"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { priceSourceFormFields } from "../PriceSourceDrawer/stuff"
import { usePriceSourcesStore } from "../shared"

const ManagementBtns = ({ data: { id } }: { data: StockPriceSourceResponse }) => (
  <div className="flex items-center gap-1 py-1">
    <button
      type="button"
      title="مشاهده جزییات"
      className={skins.btn({ intent: "info", isIcon: true, size: "small" })}
      onClick={() => {
        if (typeof id !== "number") return
        usePriceSourcesStore.getState().details(id)
      }}
    >
      <InfoIcon />
    </button>

    <button
      type="button"
      title="ویرایش"
      className={skins.btn({ intent: "warning", isIcon: true, size: "small" })}
      onClick={() => {
        if (typeof id !== "number") return
        usePriceSourcesStore.getState().edit(id)
      }}
    >
      <PencilSimpleIcon />
    </button>

    <button
      type="button"
      title="حذف"
      className={skins.btn({ intent: "error", isIcon: true, size: "small" })}
      onClick={() => {
        if (typeof id !== "number") return
        usePriceSourcesStore.getState().remove(id)
      }}
    >
      <TrashIcon />
    </button>
  </div>
)

const getLabelProperty = generateLabelPropertyGetter(priceSourceFormFields.labels)

const columnDefs: ColDef<StockPriceSourceResponse>[] = [
  { headerName: "مدیریت", cellRenderer: ManagementBtns },
  {
    field: "name",
    headerName: getLabelProperty("name"),
    cellRenderer: cellRenderers.Rtl,
  },
  {
    field: "code",
    headerName: getLabelProperty("code"),
    cellRenderer: cellRenderers.Ltr,
    minWidth: 200,
  },
  {
    field: "price",
    headerName: getLabelProperty("price"),
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "sourceUrl",
    headerName: getLabelProperty("sourceUrl"),
    cellRenderer: cellRenderers.AutoLink,
    minWidth: 200,
  },
  {
    field: "id",
    headerName: "آی‌دی",
    cellRenderer: cellRenderers.Ltr,
    minWidth: 100,
  },
]

const Table = createTypedTableFa<StockPriceSourceResponse>()

export function PriceSourcesTable({ priceSources }: { priceSources: StockPriceSourceResponse[] }) {
  return (
    <div className="h-160">
      <Table columnDefs={columnDefs} rowData={priceSources} />
    </div>
  )
}
