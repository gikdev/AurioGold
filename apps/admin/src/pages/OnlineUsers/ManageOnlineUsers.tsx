import { ArrowCounterClockwiseIcon, UsersFourIcon } from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { Btn, TableFa, TitledCard } from "@repo/shared/components"
import type { ColDef } from "ag-grid-community"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { connectionRefAtom, connectionStateAtom, onlineUsersCountAtom } from "#/atoms"
import OnlineNumberCard from "./OnlineNumberCard"

const colDefs: ColDef[] = [
  { field: "displayName", headerName: "نام" },
  { field: "mobile", headerName: "موبایل" },
  { field: "isActive", headerName: "فعال هست؟" },
  { field: "isBlocked", headerName: "مسدود کردن معامله" },
  { field: "allowedDevices", headerName: "تعداد دستگاه های مجاز" },
  { field: "connectedDevices", headerName: "تعداد دستگاه‌های فعال" },
  { field: "id", headerName: "آیدی" },
]

interface OnlineUser {
  id: number
  displayName: string
  mobile: string
  isActive: boolean
  isBlocked: boolean
  allowedDevices: number
  connectedDevices: number
}

export default function ManageOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const connectionRef = useAtomValue(connectionRefAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const [onlineUsersCount, setOnlineUsersCount] = useAtom(onlineUsersCountAtom)

  const getOnlineUsers = () => {
    if (!connectionRef || connectionState !== "connected") return

    connectionRef
      .invoke("GetConnectedUsers")
      .then(users => setOnlineUsers(users))
      .catch((err: unknown) => {
        notifManager.notify(String(err) || "یه مشکلی پیش آمده (E-AXE6785)", "toast", {
          status: "error",
        })
      })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (connectionState === "connected" && connectionRef) {
      getOnlineUsers()

      const onOnlineCount = (count: number) => {
        setOnlineUsersCount(count || "؟")
        getOnlineUsers()
      }

      connectionRef?.on("OnlineCount", onOnlineCount)

      return () => connectionRef?.off("OnlineCount")
    }

    return
  }, [connectionState])

  const cardTitleSlot = (
    <div className="flex gap-2 items-center ms-auto">
      <Btn className="h-10 w-10 p-1" onClick={() => getOnlineUsers()}>
        <ArrowCounterClockwiseIcon size={24} />
      </Btn>
    </div>
  )

  return (
    <TitledCard title="کاربران آنلاین" icon={UsersFourIcon} titleSlot={cardTitleSlot}>
      <div className="flex justify-center items-center gap-5 flex-wrap">
        <OnlineNumberCard num={onlineUsers.length} description="تعداد مشتریان آنلاین" />

        <OnlineNumberCard
          num={typeof onlineUsersCount === "number" ? onlineUsersCount : 0}
          description="تعداد کاربران آنلاین"
        />

        <OnlineNumberCard
          num={(typeof onlineUsersCount === "number" ? onlineUsersCount : 0) - onlineUsers.length}
          description="تعداد ادمین‌های آنلاین"
        />
      </div>

      <div className="h-120">
        <TableFa rowData={onlineUsers} columnDefs={colDefs} />
      </div>
    </TitledCard>
  )
}
