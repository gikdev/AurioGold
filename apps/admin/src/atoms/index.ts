import { storageManager } from "@repo/shared/adapters"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useCallback } from "react"

export * from "./signalr"
export * from "./adminConnectivity"

export const showOnlineUsersInStatusbarAtom = atomWithStorage(
  "SHOW_ONLINE_USERS_IN_STATUSBAR",
  true,
)

export const onlineUsersCountAtom = atom<"؟" | number>("؟")

const profileImageUrlAtom = atomWithStorage(
  "profileImageUrl",
  storageManager.get("logoUrl", "sessionStorage"),
)
export const useProfileImageUrlValue = () => useAtomValue(profileImageUrlAtom)
export const useSetProfileImageUrl = () => {
  const set = useSetAtom(profileImageUrlAtom)
  const setter = useCallback(
    (newUrl: string) => {
      storageManager.save("logoUrl", newUrl, "sessionStorage")
      set(newUrl)
    },
    [set],
  )

  return setter
}

const displayNameAtom = atomWithStorage("displayName", storageManager.get("name", "sessionStorage"))
export const useDisplayNameValue = () => useAtomValue(displayNameAtom)
export const useSetDisplayName = () => {
  const set = useSetAtom(displayNameAtom)
  const setter = useCallback(
    (newName: string) => {
      storageManager.save("name", newName, "sessionStorage")
      set(newName)
    },
    [set],
  )

  return setter
}
