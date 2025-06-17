import { ArrowCounterClockwiseIcon, UsersFourIcon } from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { Btn, TitledCard, createTypedTableFa } from "@repo/shared/components"
import type { ColDef } from "ag-grid-community"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { connectionRefAtom, connectionStateAtom, onlineUsersCountAtom } from "#/atoms"
import OnlineNumberCard from "./OnlineNumberCard"

const colDefs: ColDef<OnlineUser>[] = [
  { field: "displayName", headerName: "نام" },
  { field: "mobile", headerName: "موبایل" },
  { field: "isActive", headerName: "فعال هست؟" },
  { field: "isBlocked", headerName: "مسدود کردن معامله" },
  { field: "allowedDevices", headerName: "تعداد دستگاه های مجاز" },
  { field: "connectedDevices", headerName: "تعداد دستگاه‌های فعال" },
  { field: "id", headerName: "آی‌دی" },
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

const Table = createTypedTableFa<OnlineUser>()

export default function ManageOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>()
  const connection = useAtomValue(connectionRefAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const onlineUsersCount = useAtomValue(onlineUsersCountAtom)

  const getOnlineUsers = () => {
    if (!connection || connectionState !== "connected") return

    connection
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
    getOnlineUsers()
  }, [onlineUsersCount])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getOnlineUsers()
    connection?.on("OnlineCount", getOnlineUsers)

    return () => connection?.off("OnlineCount")
  }, [connectionState, connection])

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
        <OnlineNumberCard
          isOnline={onlineUsers && onlineUsers?.length > 0}
          num={onlineUsers ? onlineUsers.length : "؟"}
          description="مشتری آنلاین"
        />

        <OnlineNumberCard
          isOnline={typeof onlineUsersCount === "number" && onlineUsersCount > 0}
          num={onlineUsersCount}
          description="کاربر آنلاین"
        />

        <OnlineNumberCard
          description="ادمین آنلاین"
          isOnline={
            typeof onlineUsersCount === "number" &&
            onlineUsers &&
            onlineUsersCount - onlineUsers.length > 0
          }
          num={
            typeof onlineUsersCount === "number" && onlineUsers
              ? onlineUsersCount - onlineUsers.length
              : "؟"
          }
        />
      </div>

      <div className="h-120">
        <Table rowData={onlineUsers ?? []} loading={!onlineUsers} columnDefs={colDefs} />
      </div>
    </TitledCard>
  )
}
