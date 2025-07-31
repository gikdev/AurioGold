import { apiRequest, useApiRequest } from "@gikdev/react-datapi/src"
import type { HubConnection } from "@microsoft/signalr"
import { ArrowClockwiseIcon, CheckIcon, FunnelIcon, XIcon } from "@phosphor-icons/react"
import type { Gidto, OrderFm, OrdersByStuckDto, OrdersReturnFm } from "@repo/api-client/client"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { Btn, createTypedTableFa } from "@repo/shared/components"
import { cellRenderers } from "@repo/shared/lib"
import type { ColDef, RowClassParams, RowStyle } from "ag-grid-community"
import type { CustomCellRendererProps } from "ag-grid-react"
import { useAtomValue } from "jotai"
import { useCallback, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { connectionRefAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import routes from "../routes"
import FilterDrawer from "./FilterDrawer"
import { OrdersNavigation } from "./navigation"
import { useDateFilter } from "./useDateFilter"

export function acceptOrRejectOrder(
  isOrderNotif: boolean,
  id: number,
  isAccepted: boolean,
  cb: () => void,
) {
  const dataToSend: Required<Gidto> = {
    gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    id: Number(id),
    str: "",
    tf: isAccepted,
  }

  apiRequest({
    config: genDatApiConfig(),
    options: {
      url: "/Master/AcceptOrders",
      method: "POST",
      body: JSON.stringify(dataToSend),
      onSuccess() {
        cb()
        if (isOrderNotif) return
        notifManager.notify("با موفقیت انجام شد", "toast", { status: "success" })
      },
    },
  })
}

function signalrDecideOrder(
  connection: HubConnection,
  token: string,
  isAccepted: boolean,
  orderId: number,
  userId: number,
) {
  connection
    .invoke("DecideOrder", token, isAccepted, orderId, userId)
    .catch(err =>
      notifManager.notify(err ? String(err) : "یه مشکلی پیش آمد!", "toast", { status: "error" }),
    )
}

function ManagementBtns({ data }: CustomCellRendererProps<OrderFm>) {
  const connection = useAtomValue(connectionRefAtom)
  const areDisabled = [3, 4].includes(data?.orderStatus || 0)
  const navigate = useNavigate()
  const className = "min-h-8 py-1 px-2 text-xs flex items-center"

  const handleAccept = useCallback(() => {
    const isAccepted = true
    const token = storageManager.get("ttkk", "sessionStorage")

    if (!token) {
      notifManager.notify("خودتان معتبر نیستید!!! دوباره وارد شوید!", "toast", { status: "error" })
      navigate(routes.logout)

      return
    }

    if (!connection) {
      notifManager.notify("وقتی متصل نیستیم، نمی‌توان سفارشی را رد یا تایید کرد...", "toast", {
        status: "error",
      })

      return
    }

    if (!data || typeof data.userID !== "number") {
      notifManager.notify("آی‌دی مشتری مورد نظر معتبر نیست!", "toast", {
        status: "error",
      })

      return
    }

    if (!data || typeof data.id !== "number") {
      notifManager.notify("آی‌دی سفارش مورد نظر معتبر نیست!", "toast", {
        status: "error",
      })

      return
    }

    const { id: orderId, userID } = data

    acceptOrRejectOrder(false, orderId, isAccepted, () => {
      signalrDecideOrder(connection, token, isAccepted, orderId, userID)
    })
  }, [data, connection, navigate])

  const handleReject = useCallback(() => {
    const isAccepted = false
    const token = storageManager.get("ttkk", "sessionStorage")

    if (!token) {
      notifManager.notify("خودتان معتبر نیستید!!! دوباره وارد شوید!", "toast", { status: "error" })
      navigate(routes.logout)

      return
    }

    if (!connection) {
      notifManager.notify("وقتی متصل نیستیم، نمی‌توان سفارشی را رد یا تایید کرد...", "toast", {
        status: "error",
      })

      return
    }

    if (!data || typeof data.userID !== "number") {
      notifManager.notify("آی‌دی مشتری مورد نظر معتبر نیست!", "toast", {
        status: "error",
      })

      return
    }

    if (!data || typeof data.id !== "number") {
      notifManager.notify("آی‌دی سفارش مورد نظر معتبر نیست!", "toast", {
        status: "error",
      })

      return
    }

    const { id: orderId, userID } = data

    acceptOrRejectOrder(false, orderId, isAccepted, () => {
      signalrDecideOrder(connection, token, isAccepted, orderId, userID)
    })
  }, [data, connection, navigate])

  return (
    <div className="flex gap-1 items-center pt-1">
      <Btn className={className} theme="success" disabled={areDisabled} onClick={handleAccept}>
        <CheckIcon size={16} />
        <span>تایید</span>
      </Btn>

      <Btn className={className} theme="error" disabled={areDisabled} onClick={handleReject}>
        <XIcon size={16} />
        <span>رد کردن</span>
      </Btn>
    </div>
  )
}

function getRowStyle({ data }: RowClassParams<OrderFm>): RowStyle | undefined {
  if (!data) return

  const { orderStatus, side } = data

  // رد شده
  // slate-3
  if (orderStatus === 4) return { background: "#212225" }

  // خرید
  // green-3
  if (side === 1) return { background: "#0f2e22" }

  // فروش
  // red-3
  if (side === 2) return { background: "#3b1219" }

  return
}

const ordersColDef: ColDef<OrderFm>[] = [
  {
    headerName: "مدیریت",
    cellRenderer: ManagementBtns,
    minWidth: 180,
  },
  {
    field: "price",
    headerName: "قیمت",
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
    field: "dlrCustomer",
    headerName: "مشتری",
  },
  {
    field: "dlrPhone",
    headerName: "موبایل",
    cellRenderer: cellRenderers.PersianNum,
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

const stocksColDef: ColDef<OrdersByStuckDto>[] = [
  {
    field: "stockName",
    headerName: "نام محصول",
  },
  {
    field: "volumeBuyAvg",
    headerName: "میانگین خرید حجمی",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "volumeSellAvg",
    headerName: "میانگین فروش حجمی",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "buySum",
    headerName: "جمع خرید ریالی",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "sellSum",
    headerName: "جمع فروش ریالی",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "volumeBuySum",
    headerName: "جمع خرید وزنی",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "volumeSellSum",
    headerName: "جمع فروش وزنی",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "volumeTaraaz",
    headerName: "تراز وزنی",
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "taraaz",
    headerName: "تراز",
    cellRenderer: cellRenderers.PersianComma,
  },
]

const TableOrders = createTypedTableFa<OrderFm>()
const TableStocks = createTypedTableFa<OrdersByStuckDto>()

const emptyOrdersReturnFm: OrdersReturnFm = {
  orderFMs: null,
  stucksFMs: null,
}

const stocksDefaultColDef: ColDef<OrdersByStuckDto> = {
  filter: false,
  floatingFilter: false,
}

export default function OrdersTable() {
  const connection = useAtomValue(connectionRefAtom)
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

  // Refetch stuff from API when something changed...
  // I know it should be like I'd be modifying data myself...
  // But it's what it is...
  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (!connection) return undefined

    connection.on("ReceiveOrder2", () => resOrders.reload())
    connection.on("UpdateCOrder", () => resOrders.reload())
    connection.on("Decided", () => resOrders.reload())

    return () => {
      connection.off("ReceiveOrder2")
      connection.off("UpdateCOrder")
      connection.off("Decided")
    }
  }, [connection])

  return (
    <div className="flex flex-col gap-10">
      <FilterDrawer dateFilterState={dateFilterState} />

      <div className="h-160 flex flex-col">
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

        <TableOrders
          rowData={resOrders.data?.orderFMs ?? []}
          columnDefs={ordersColDef}
          getRowStyle={getRowStyle}
        />
      </div>

      <div className="h-120 flex flex-col">
        <div className="flex items-center gap-1">
          <h2 className="text-slate-12 font-bold bg-slate-2 pt-1 px-2 rounded-t-md pb-3 relative top-3 border border-slate-6 me-auto">
            جدول خلاصه:
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

        <TableStocks
          rowData={resOrders.data?.stucksFMs ?? []}
          columnDefs={stocksColDef}
          defaultColDef={stocksDefaultColDef}
        />
      </div>
    </div>
  )
}
