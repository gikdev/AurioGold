import { useApiRequest } from "@gikdev/react-datapi/src"
import { FunnelIcon } from "@phosphor-icons/react"
import type { OrderFm, OrdersByStuckDto, OrdersReturnFm } from "@repo/api-client/client"
import { createTypedTableFa } from "@repo/shared/components"
import type { ColDef } from "ag-grid-community"
import { useMemo } from "react"
import { Link } from "react-router"
import FilterDrawer from "./FilterDrawer"
import { OrdersNavigation } from "./navigation"
import { useDateFilter } from "./useDateFilter"

const ordersColDef: ColDef<OrderFm>[] = [
  {
    field: "price",
    headerName: "قیمت",
  },
  {
    field: "volume",
    headerName: "مقدار",
  },
  {
    field: "value",
    headerName: "ارزش معامله (ریال)",
  },
  {
    field: "side",
    headerName: "نوع سفارش",
  },
  {
    field: "dlrCustomer",
    headerName: "مشتری",
  },
  {
    field: "dlrPhone",
    headerName: "موبایل",
  },
  {
    field: "orderStatus",
    headerName: "وضعیت سفارش",
  },
  {
    field: "createDate",
    headerName: "تاریخ ثبت",
  },
  {
    field: "time",
    headerName: "زمان",
  },
  {
    field: "stockName",
    headerName: "نام محصول",
  },
]

const stocksColDef: ColDef<OrdersByStuckDto>[] = [
  {
    field: "stockName",
    headerName: "نام محصول",
  },
  {
    field: "volumeBuyAvg",
    headerName: "میانگین خرید حجمی",
  },
  {
    field: "volumeSellAvg",
    headerName: "میانگین فروش حجمی",
  },
  {
    field: "buySum",
    headerName: "جمع خرید ریالی",
  },
  {
    field: "sellSum",
    headerName: "جمع فروش ریالی",
  },
  {
    field: "volumeBuySum",
    headerName: "جمع خرید وزنی",
  },
  {
    field: "volumeSellSum",
    headerName: "جمع فروش وزنی",
  },
  {
    field: "volumeTaraaz",
    headerName: "تراز وزنی",
  },
  {
    field: "taraaz",
    headerName: "تراز",
  },
]

const TableOrders = createTypedTableFa<OrderFm>()
const TableStocks = createTypedTableFa<OrdersByStuckDto>()

const emptyOrdersReturnFm: OrdersReturnFm = {
  orderFMs: null,
  stucksFMs: null,
}

export default function OrdersTable() {
  const dateFilterState = useDateFilter()
  const dataToSend = {
    start: dateFilterState.fromDate.toISOString(),
    end: dateFilterState.toDate.toISOString(),
    countPerPage: 1000,
    pageNumber: 1,
  }
  const resOrders = useApiRequest<OrdersReturnFm | null>(() => ({
    url: "/Master/GetOrders",
    method: "POST",
    body: JSON.stringify(dataToSend),
    defaultValue: emptyOrdersReturnFm,
    dependencies: [dateFilterState.fromDate, dateFilterState.toDate],
  }))
  const stocksDefaultColDef: ColDef<OrdersByStuckDto> = useMemo(
    () => ({
      filter: false,
      floatingFilter: false,
    }),
    [],
  )

  return (
    <div className="flex flex-col gap-10">
      <FilterDrawer dateFilterState={dateFilterState} />

      <div className="h-160 flex flex-col">
        <div className="flex items-center gap-1">
          <h2 className="text-slate-12 font-bold bg-slate-2 pt-1 px-2 rounded-t-md pb-3 relative top-3 border border-slate-6 me-auto">
            جدول سفارشات:
          </h2>

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

        <TableOrders rowData={resOrders.data?.orderFMs ?? []} columnDefs={ordersColDef} />
      </div>

      <div className="h-120 flex flex-col">
        <div className="flex items-center gap-1">
          <h2 className="text-slate-12 font-bold bg-slate-2 pt-1 px-2 rounded-t-md pb-3 relative top-3 border border-slate-6 me-auto">
            جدول خلاصه:
          </h2>

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

        <TableStocks
          rowData={resOrders.data?.stucksFMs ?? []}
          columnDefs={stocksColDef}
          defaultColDef={stocksDefaultColDef}
        />
      </div>
    </div>
  )
}
