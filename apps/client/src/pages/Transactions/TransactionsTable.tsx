import { ArrowClockwiseIcon, FunnelIcon } from "@phosphor-icons/react"
import {
  type PageDto,
  postApiCustomerGetTransActionOptions,
  type TransactionDto,
} from "@repo/api-client"
import { createTypedTableFa } from "@repo/shared/components"
import { cellRenderers } from "@repo/shared/lib"
import { useQuery } from "@tanstack/react-query"
import { type ComponentProps, useMemo } from "react"
import { useDateFilterStore } from "./shared"

const TableTransactions = createTypedTableFa<TransactionDto>()
type TableTransactionsProps = ComponentProps<typeof TableTransactions>

const ordersColDef: TableTransactionsProps["columnDefs"] = [
  { field: "confirmer", headerName: "تایید کننده" },
  { field: "price", headerName: "قیمت (ریال)", cellRenderer: cellRenderers.PersianCurrency },
  { field: "taType", headerName: "نوع تا؟" },
  { field: "time", headerName: "تاریخ", cellRenderer: cellRenderers.DateOnly },
  { field: "time", headerName: "زمان", cellRenderer: cellRenderers.TimeOnly },
  { field: "title", headerName: "عنوان" },
  { field: "tyCustomer", headerName: "مشتری" },
  { field: "tyStock", headerName: "محصول" },
  { field: "value", headerName: "ارزش", cellRenderer: cellRenderers.PersianCurrency },
  { field: "volume", headerName: "مقدار", cellRenderer: cellRenderers.PersianComma },
]

export default function TransactionsTable() {
  const countPerPage = useDateFilterStore(s => s.count)
  const start = useDateFilterStore(s => s.fromDate.toISOString())
  const end = useDateFilterStore(s => s.toDate.toISOString())
  const pageNumber = useDateFilterStore(s => s.page)

  const body: PageDto = useMemo(
    () => ({ countPerPage, start, end, pageNumber }),
    [countPerPage, start, end, pageNumber],
  )

  const { data: transactions = [], refetch } = useQuery(
    postApiCustomerGetTransActionOptions({ body }),
  )

  return (
    <div className="flex flex-col gap-10 flex-1">
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1">
          <h2 className="text-slate-12 font-bold bg-slate-2 pt-1 px-2 rounded-t-md pb-3 relative top-3 border border-slate-6 me-auto">
            جدول سفارشات:
          </h2>

          <button
            type="button"
            onClick={() => refetch()}
            className="
              text-slate-11 bg-slate-3 transition-all
              hover:text-slate-12 hover:bg-slate-4
              pt-1 px-2 rounded-t-md pb-3 top-2 
              relative border border-slate-6
              cursor-pointer active:top-3
            "
          >
            <ArrowClockwiseIcon size={24} />
          </button>

          <button
            type="button"
            onClick={() => useDateFilterStore.getState().setOpen(true)}
            className="
              text-slate-11 bg-slate-3 transition-all
              hover:text-slate-12 hover:bg-slate-4
              pt-1 px-2 rounded-t-md pb-3 top-2 
              relative border border-slate-6
              cursor-pointer active:top-3
            "
          >
            <FunnelIcon size={24} />
          </button>
        </div>

        <div className="flex-1 min-h-80">
          <TableTransactions rowData={transactions} columnDefs={ordersColDef} />
        </div>
      </div>
    </div>
  )
}
