import type { StockDtoForMaster } from "@repo/api-client/client"
import { BtnTemplates, createTypedTableFa } from "@repo/shared/components"
import type { CustomCellRendererProps } from "ag-grid-react"
import type { ComponentProps } from "react"
import { Link } from "react-router"
import { Navigation } from "./navigation"
import { cellRenderers } from "#/shared/agGrid"
import { calcA11yStuff } from "./ProductCards"

type DataShape = Required<StockDtoForMaster>
const Table = createTypedTableFa<DataShape>()
type TableProps = ComponentProps<typeof Table>

const columnDefs: TableProps["columnDefs"] = [
  {
    headerName: "مدیریت",
    cellRenderer: ManagementBtns,
    maxWidth: 140,
    filter: false,
    sortable: false,
    floatingFilter: false,
  },
  {
    field: "name",
    headerName: "نام",
  },
  {
    field: "status",
    headerName: "وضعیت دسترسی",
    cellRenderer: ProductStatusCell,
    minWidth: 200,
  },
  {
    field: "price",
    headerName: "قیمت",
    cellRenderer: cellRenderers.PersianComma,
    minWidth: 200,
  },
]

interface ProductsTableProps {
  products: TableProps["rowData"]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="h-160">
      <Table rowData={products} columnDefs={columnDefs} />
    </div>
  )
}

function ManagementBtns({ data }: CustomCellRendererProps<DataShape>) {
  if (!data?.id) return null

  const { id } = data

  return (
    <div className="flex items-center gap-1 py-1">
      <BtnTemplates.IconInfo as={Link} to={Navigation.details(id!)} className="min-h-8 w-8 p-1" />
      <BtnTemplates.IconEdit as={Link} to={Navigation.edit(id!)} className="min-h-8 w-8 p-1" />
      <BtnTemplates.IconDelete as={Link} to={Navigation.delete(id!)} className="min-h-8 w-8 p-1" />
    </div>
  )
}

function ProductStatusCell(props: CustomCellRendererProps<DataShape>) {
  const status = props.value satisfies DataShape["status"]
  const a11yStuff = calcA11yStuff(status)

  return (
    <div className="pt-1 flex items-center gap-1">
      <abbr className="contents pt-1" title={a11yStuff.title}>
        <a11yStuff.Icon size={24} className={a11yStuff.classes} />
      </abbr>

      <p>{a11yStuff.name}</p>
    </div>
  )
}
