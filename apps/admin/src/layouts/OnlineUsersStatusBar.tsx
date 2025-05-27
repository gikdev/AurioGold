import { connectionRefAtom, connectionStateAtom, showOnlineUsersInStatusbarAtom } from "#/atoms"
import { notifManager } from "@repo/shared/adapters"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"

export default function OnlineUsersStatusBar() {
  const showOnlineUsersInStatusbar = useAtomValue(showOnlineUsersInStatusbarAtom)
  const connection = useAtomValue(connectionRefAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const [onlineUsers, setOnlineUsers] = useState<Array<{ id: number; displayName: string }>>([])

  const getOnlineUsers = () => {
    if (!connection || connectionState !== "connected") return

    connection
      .invoke("GetConnectedUsers")
      .then(users => setOnlineUsers(users))
      .catch(() => notifManager.notify("یه مشکلی پیش آمده (E-AXE6785)", "console"))
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (connectionState === "connected" && connection) {
      getOnlineUsers()

      const onOnlineCount = (_count: number) => {
        getOnlineUsers()
      }

      connection.on("OnlineCount", onOnlineCount)

      return () => connection.off("OnlineCount")
    }

    return undefined
  }, [connectionState])

  if (!showOnlineUsersInStatusbar) return null

  return (
    <div className="w-full bg-slate-2 py-2 flex border-t border-slate-6">
      <p className="border-e border-slate-6 px-2 flex items-center gap-2">
        <div className="flex items-center">
          <i
            className="
              rounded-full bg-green-9 w-3 h-3 inline-block before:animate-ping relative
              before:rounded-full before:bg-green-9 before:w-3 before:h-3 before:inline-block before:absolute
             "
          />
        </div>
        <span className="font-bold">افراد آنلاین</span>
      </p>
      <div className="overflow-hidden whitespace-nowrap grow shrink text-slate-11">
        <p className="w-full animate-marquee-fast md:animate-marquee-slow flex items-center gap-3">
          {onlineUsers.map((u, i) => (
            <span key={u.id} className="inline-block">
              {u.displayName}
              {onlineUsers.length === i + 1 ? "" : ","}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
