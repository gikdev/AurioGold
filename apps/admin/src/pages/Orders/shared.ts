import type { HubConnection } from "@microsoft/signalr"
import type { OrderFm, PageDto } from "@repo/api-client/client"
import {
  postApiMasterAcceptOrdersMutation,
  postApiMasterGetOrdersOptions,
} from "@repo/api-client/tanstack"
import { notifManager } from "@repo/shared/adapters"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { parseError } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import type { RowClassParams, RowStyle } from "ag-grid-community"
import { useAtomValue } from "jotai"
import { useEffect, useMemo } from "react"
import { create } from "zustand"
import { connectionRefAtom } from "#/atoms"
import { queryClient } from "#/shared"

export function getRowStyle({ data }: RowClassParams<OrderFm>): RowStyle | undefined {
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

export function useAcceptOrder() {
  return useMutation({
    ...postApiMasterAcceptOrdersMutation({
      ...getHeaderTokenOnly("admin"),
    }),
  })
}

export const refetchGetOrders = () =>
  queryClient.refetchQueries(
    postApiMasterGetOrdersOptions({
      ...getHeaderTokenOnly("admin"),
      body: getPageDto(),
    }),
  )

function handleReceiveOrder2(_orderId: number, _order: OrderFm, _usersName: string) {
  refetchGetOrders()
}

function handleDecided(_isAccepted: boolean, _orderId: number) {
  refetchGetOrders()
}

export function useHandleOrdersUpdate() {
  const connection = useAtomValue(connectionRefAtom)

  useEffect(() => {
    if (!connection) return undefined

    connection.on("ReceiveOrder2", handleReceiveOrder2)
    connection.on("Decided", handleDecided)

    return () => {
      connection.off("ReceiveOrder2", handleReceiveOrder2)
      connection.off("Decided", handleDecided)
    }
  }, [connection])
}

export function signalrDecideOrder(
  connection: HubConnection,
  token: string,
  isAccepted: boolean,
  orderId: number,
  userId: number,
) {
  connection
    .invoke("DecideOrder", token, isAccepted, orderId, userId)
    .catch(err => notifManager.notify(parseError(err), "toast", { status: "error" }))
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

interface DateFilterState {
  fromDate: Date
  toDate: Date
  setFromDate: (date: Date) => void
  setToDate: (date: Date) => void
  resetDate: () => void

  isOpen: boolean
  setOpen: (isOpen: boolean) => void

  page: number
  count: number

  resetAll: () => void
}

export const useDateFilterStore = create<DateFilterState>()(set => ({
  fromDate: startOfDay(new Date()),
  toDate: endOfDay(new Date()),

  setFromDate: date => set({ fromDate: startOfDay(date) }),
  setToDate: date => set({ toDate: endOfDay(date) }),
  resetDate: () =>
    set({
      fromDate: startOfDay(new Date()),
      toDate: endOfDay(new Date()),
    }),

  isOpen: false,
  setOpen: isOpen => set({ isOpen }),

  page: 1,
  count: 100,

  resetAll: () =>
    set({
      isOpen: false,
      fromDate: startOfDay(new Date()),
      toDate: endOfDay(new Date()),
    }),
}))

export function getPageDto() {
  const { count, fromDate, page: pageNumber, toDate } = useDateFilterStore.getState()

  const pageDto: PageDto = {
    pageNumber,
    countPerPage: count,
    start: fromDate.toISOString(),
    end: toDate.toISOString(),
  }

  return pageDto
}

export function usePageDto() {
  const count = useDateFilterStore(s => s.count)
  const pageNumber = useDateFilterStore(s => s.page)
  const fromDate = useDateFilterStore(s => s.fromDate)
  const toDate = useDateFilterStore(s => s.toDate)

  const pageDto: PageDto = useMemo(
    () => ({
      pageNumber,
      countPerPage: count,
      start: fromDate.toISOString(),
      end: toDate.toISOString(),
    }),
    [pageNumber, count, fromDate, toDate],
  )

  return pageDto
}
