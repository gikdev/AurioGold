import type { OrdersByStuckDto, OrdersReturnFm } from "@repo/api-client/client"
import { postApiMasterGetOrdersOptions } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { createTypedTableFa, SmallErrorWithRetryBtn } from "@repo/shared/components"
import { parseError } from "@repo/shared/helpers"
import { cellRenderers } from "@repo/shared/lib"
import { useQuery } from "@tanstack/react-query"
import type { ColDef } from "ag-grid-community"
import { usePageDto } from "../shared"

const TypedTable = createTypedTableFa<OrdersByStuckDto>()

const select = (data: OrdersReturnFm) => data.stucksFMs ?? []

export function StocksTable() {
  const pageDto = usePageDto()
  const {
    data: stocks = [],
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery({
    ...postApiMasterGetOrdersOptions({
      ...getHeaderTokenOnly(),
      body: pageDto,
    }),
    select,
  })

  if (isPending) return <div className="h-100 rounded-md animate-pulse bg-slate-4" />

  if (isError)
    return <SmallErrorWithRetryBtn details={parseError(error)} onClick={() => refetch()} />

  if (isSuccess) return <TypedTable rowData={stocks} columnDefs={columnDefs} />

  return null
}

const columnDefs: ColDef<OrdersByStuckDto>[] = [
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
