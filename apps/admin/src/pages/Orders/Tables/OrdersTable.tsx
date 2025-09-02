import { CheckIcon, XIcon } from "@phosphor-icons/react"
import type { OrderFm, OrdersReturnFm } from "@repo/api-client"
import { postApiMasterGetOrdersOptions } from "@repo/api-client"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { createTypedTableFa, SmallErrorWithRetryBtn } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { parseError } from "@repo/shared/helpers"
import { cellRenderers } from "@repo/shared/lib"
import { useQuery } from "@tanstack/react-query"
import type { ColDef } from "ag-grid-community"
import type { CustomCellRendererProps } from "ag-grid-react"
import { useAtomValue } from "jotai"
import { useCallback } from "react"
import { useNavigate } from "react-router"
import { connectionRefAtom } from "#/atoms"
import routes from "#/pages/routes"
import {
  getRowStyle,
  signalrDecideOrder,
  useAcceptOrder,
  useHandleOrdersUpdate,
  usePageDto,
} from "../shared"

const TypedTable = createTypedTableFa<OrderFm>()

const select = (data: OrdersReturnFm) => data.orderFMs ?? []

export function OrdersTable() {
  const pageDto = usePageDto()
  const {
    data: orders = [],
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery({
    ...postApiMasterGetOrdersOptions({
      body: pageDto,
    }),
    select,
  })

  useHandleOrdersUpdate()

  if (isPending) return <div className="h-100 rounded-md animate-pulse bg-slate-4" />

  if (isError)
    return <SmallErrorWithRetryBtn details={parseError(error)} onClick={() => refetch()} />

  if (isSuccess)
    return <TypedTable rowData={orders} columnDefs={columnDefs} getRowStyle={getRowStyle} />

  return null
}

const columnDefs: ColDef<OrderFm>[] = [
  {
    headerName: "مدیریت",
    cellRenderer: ManagementBtns,
    minWidth: 180,
  },
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

function ManagementBtns({ data }: CustomCellRendererProps<OrderFm>) {
  const connection = useAtomValue(connectionRefAtom)
  const areDisabled = [3, 4].includes(data?.orderStatus || 0)
  const navigate = useNavigate()
  const { mutate: acceptOrder } = useAcceptOrder()

  const handleAccept = useCallback(
    (isAccepted: boolean) => {
      const token = storageManager.get("admin_ttkk", "sessionStorage")

      if (!token) {
        notifManager.notify("خودتان معتبر نیستید!!! دوباره وارد شوید!", "toast", {
          status: "error",
        })

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

      acceptOrder(
        {
          body: {
            gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            id: Number(orderId),
            str: "",
            tf: isAccepted,
          },
        },
        {
          onError: err => notifManager.notify(parseError(err), "toast", { status: "error" }),
          onSuccess: () => {
            signalrDecideOrder(connection, token, isAccepted, orderId, userID)
            notifManager.notify("با موفقیت انجام شد", "toast", { status: "success" })
          },
        },
      )
    },
    [data, connection, navigate, acceptOrder],
  )

  return (
    <div className="flex gap-1 items-center pt-1">
      <button
        type="button"
        disabled={areDisabled}
        onClick={() => handleAccept(true)}
        className={skins.btn({ size: "small", intent: "success" })}
      >
        <CheckIcon size={16} />
        <span>تایید</span>
      </button>

      <button
        type="button"
        disabled={areDisabled}
        onClick={() => handleAccept(false)}
        className={skins.btn({ size: "small", intent: "error" })}
      >
        <XIcon size={16} />
        <span>رد کردن</span>
      </button>
    </div>
  )
}
