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

type Transaction = {
  id: 1 | 2 | 3 | 4
  name: "buy" | "sell" | "importMoney" | "exportMoney"
  title: "خرید" | "فروش" | "ورود پول" | "خروج پول"
}

const buyTx: Transaction = { id: 1, name: "buy", title: "خرید" } as const
const sellTx: Transaction = { id: 2, name: "sell", title: "فروش" } as const
const importMoneyTx: Transaction = { id: 3, name: "importMoney", title: "ورود پول" } as const
const exportMoneyTx: Transaction = { id: 4, name: "exportMoney", title: "خروج پول" } as const

const getTransaction = (key: Transaction["id"] | Transaction["name"] | Transaction["title"]) => {
  if (key === 1 || key === "buy" || key === "خرید") return buyTx
  if (key === 2 || key === "sell" || key === "فروش") return sellTx
  if (key === 3 || key === "importMoney" || key === "ورود پول") return importMoneyTx
  if (key === 4 || key === "exportMoney" || key === "خروج پول") return exportMoneyTx

  return null
}

const TableTransactions = createTypedTableFa<TransactionDto>()
type TableTransactionsProps = ComponentProps<typeof TableTransactions>

const ordersColDef: TableTransactionsProps["columnDefs"] = [
  { field: "confirmer", headerName: "تایید کننده" },
  { field: "price", headerName: "قیمت (ریال)", cellRenderer: cellRenderers.PersianCurrency },
  {
    field: "taType",
    headerName: "نوع تراکنش",
    cellRenderer: ({ value }: { value: 1 | 2 | 3 | 4 }) => (
      <p>{getTransaction(value)?.title || "-"}</p>
    ),
  },
  { field: "time", headerName: "تاریخ", cellRenderer: cellRenderers.DateOnly },
  { field: "time", headerName: "زمان", cellRenderer: cellRenderers.TimeOnly },
  { field: "title", headerName: "عنوان", minWidth: 320 },
  { field: "tyCustomer", headerName: "مشتری" },
  { field: "tyStock", headerName: "محصول" },
  { field: "value", headerName: "ارزش معامله", cellRenderer: cellRenderers.PersianCurrency },
  { field: "volume", headerName: "مقدار معامله", cellRenderer: cellRenderers.PersianComma },
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
