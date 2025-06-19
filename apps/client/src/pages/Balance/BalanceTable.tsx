import { createTypedTableFa } from "@repo/shared/components"
import type { ComponentProps } from "react"
import { cellRenderers } from "#/shared/agGrid"
import type { MasterPortfolioWithId } from "./ManageBalance"

const Table = createTypedTableFa<MasterPortfolioWithId>()
type TableProps = ComponentProps<typeof Table>

const columnDefs: TableProps["columnDefs"] = [
  {
    field: "stockName",
    headerName: "نام محصول",
    minWidth: 200,
  },
  {
    field: "volume",
    headerName: "مقدار محصول",
    cellRenderer: cellRenderers.Debt,
    minWidth: 240,
  },
]

export default function BalanceTable({ portfolios }: { portfolios: TableProps["rowData"] }) {
  return (
    <div className="h-160">
      <Table columnDefs={columnDefs} rowData={portfolios} />
    </div>
  )
}
