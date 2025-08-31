import { notifManager, storageManager } from "@repo/shared/adapters"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { connectionRefAtom, connectionStateAtom } from "./signalr"

const getIsAdminOnlin = (statusCode: number | 1 | 2 | 3) => statusCode === 2

export const isAdminOnlineAtom = atom(false)

export function useToggleAdminConnectivity() {
  const setAdminOnline = useSetAtom(isAdminOnlineAtom)
  const connection = useAtomValue(connectionRefAtom)
  const connectionState = useAtomValue(connectionStateAtom)

  return (newIsAdminOnline: boolean) => {
    if (!connection) return
    if (connectionState !== "connected") return

    const token = storageManager.get("admin_ttkk", "sessionStorage")
    const masterId = storageManager.get("admin_masterID", "sessionStorage")

    connection
      .invoke("ToggleOnline", token, masterId ? Number(masterId) : null, newIsAdminOnline)
      .then(() => setAdminOnline(newIsAdminOnline))
      .catch(err => {
        notifManager.notify(err, "console", { status: "error" })
        notifManager.notify("نشد وضعیت فروشگاه رو تغییر بدیم،‌ بعدا لطفا امتحان کنید", "toast", {
          status: "error",
        })
      })
  }
}

export function useManageAdminConnectivity() {
  const setAdminOnline = useSetAtom(isAdminOnlineAtom)
  const status = storageManager.get("admin_status", "sessionStorage")

  if (!status) return

  const isOnline = getIsAdminOnlin(Number(status))
  setAdminOnline(isOnline)
  return
}
