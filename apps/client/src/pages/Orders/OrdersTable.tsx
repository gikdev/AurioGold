import { useApiRequest } from "@gikdev/react-datapi/src"
import { ArrowClockwiseIcon, FunnelIcon } from "@phosphor-icons/react"
import type { OrderFc } from "@repo/api-client"
import { createTypedTableFa } from "@repo/shared/components"
import { cellRenderers } from "@repo/shared/lib"
import { useAtomValue } from "jotai"
import { type ComponentProps, useEffect, useMemo } from "react"
import { Link } from "react-router"
import { connectionRefAtom } from "#/atoms"
import FilterDrawer from "./FilterDrawer"
import { OrdersNavigation } from "./navigation"
import { useDateFilter } from "./useDateFilter"

const TableOrders = createTypedTableFa<OrderFc>()
type TableOrdersProps = ComponentProps<typeof TableOrders>

const getRowStyle: TableOrdersProps["getRowStyle"] = ({ data }) => {
  if (!data) return

  const { orderStatus, side } = data

  // رد شده — slate-3 with 50% opacity
  if (orderStatus === 4) {
    return { background: "rgba(44, 47, 51, 0.5)" } // from #2c2f33
  }

  // خرید — green-3 with 50% opacity
  if (side === 1) {
    return { background: "rgba(17, 102, 68, 0.5)" } // from #116644
  }

  // فروش — red-3 with 50% opacity
  if (side === 2) {
    return { background: "rgba(110, 27, 35, 0.5)" } // from #6e1b23
  }

  return
}

const ordersColDef: TableOrdersProps["columnDefs"] = [
  {
    field: "price",
    headerName: "قیمت (ریال)",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "volume",
    headerName: "مقدار",
    cellRenderer: cellRenderers.PersianNum,
  },
  {
    field: "value",
    headerName: "ارزش معامله (ریال)",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "side",
    headerName: "نوع سفارش",
    cellRenderer: cellRenderers.OrderSide,
  },
  {
    field: "orderStatus",
    headerName: "وضعیت سفارش",
    cellRenderer: cellRenderers.OrderStatus,
  },
  {
    field: "createDate",
    headerName: "تاریخ ثبت",
    cellRenderer: cellRenderers.DateOnly,
  },
  {
    field: "time",
    headerName: "زمان",
    cellRenderer: cellRenderers.TimeOnly,
  },
  {
    field: "stockName",
    headerName: "نام محصول",
  },
]

export default function OrdersTable() {
  const connection = useAtomValue(connectionRefAtom)
  const dateFilterState = useDateFilter()
  const dataToSend = useMemo(
    () => ({
      start: dateFilterState.fromDate.toISOString(),
      end: dateFilterState.toDate.toISOString(),
      countPerPage: 1000,
      pageNumber: 1,
    }),
    [dateFilterState.fromDate, dateFilterState.toDate],
  )
  const resOrders = useApiRequest<OrderFc[]>(() => ({
    url: "/Customer/GetOrders",
    method: "POST",
    body: JSON.stringify(dataToSend),
    defaultValue: [],
    dependencies: [dataToSend],
  }))

  // Refetch stuff from API when something changed...
  // I know it should be like I'd be modifying data myself...
  // But it's what it is...
  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (!connection) return undefined

    const reload = () => resOrders.reload()

    connection.on("ReceiveOrder2", reload)
    connection.on("UpdateCOrder", reload)
    connection.on("Decided", reload)

    return () => {
      connection.off("ReceiveOrder2", reload)
      connection.off("UpdateCOrder", reload)
      connection.off("Decided", reload)
    }
  }, [connection])

  return (
    <div className="flex flex-col gap-10 flex-1">
      <FilterDrawer dateFilterState={dateFilterState} />

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1">
          <h2 className="text-slate-12 font-bold bg-slate-2 pt-1 px-2 rounded-t-md pb-3 relative top-3 border border-slate-6 me-auto">
            جدول سفارشات:
          </h2>

          <button
            type="button"
            onClick={() => resOrders.reload()}
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

          <Link
            to={OrdersNavigation.filter()}
            className="
              text-slate-11 bg-slate-3 transition-all
              hover:text-slate-12 hover:bg-slate-4
              pt-1 px-2 rounded-t-md pb-3 top-2 
              relative border border-slate-6
              cursor-pointer active:top-3
            "
          >
            <FunnelIcon size={24} />
          </Link>
        </div>

        <div className="flex-1 min-h-80">
          <TableOrders
            rowData={resOrders.data ?? []}
            columnDefs={ordersColDef}
            getRowStyle={getRowStyle}
          />
        </div>
      </div>
    </div>
  )
}
