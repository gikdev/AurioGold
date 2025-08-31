import { storageManager } from "@repo/shared/adapters"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useCallback } from "react"

export * from "./adminConnectivity"
export * from "./signalr"

export const settingsShowOnlineUsersAtom = atomWithStorage("settings-show-online-users", false)
export const onlineUsersCountAtom = atom<number | null>(null)

const profileImageUrlAtom = atomWithStorage(
  "profileImageUrl",
  storageManager.get("admin_logoUrl", "sessionStorage"),
)
export const useProfileImageUrlValue = () => useAtomValue(profileImageUrlAtom)
export const useSetProfileImageUrl = () => {
  const set = useSetAtom(profileImageUrlAtom)
  const setter = useCallback(
    (newUrl: string) => {
      storageManager.save("admin_logoUrl", newUrl, "sessionStorage")
      set(newUrl)
    },
    [set],
  )

  return setter
}

const displayNameAtom = atomWithStorage(
  "displayName",
  storageManager.get("admin_name", "sessionStorage"),
)
export const useDisplayNameValue = () => useAtomValue(displayNameAtom)
export const useSetDisplayName = () => {
  const set = useSetAtom(displayNameAtom)
  const setter = useCallback(
    (newName: string) => {
      storageManager.save("admin_name", newName, "sessionStorage")
      set(newName)
    },
    [set],
  )

  return setter
}
