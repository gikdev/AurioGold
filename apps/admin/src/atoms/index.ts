import { storageManager } from "@repo/shared/adapters"
import { useAtomValue, useSetAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export * from "./adminConnectivity"
export * from "./signalr"

interface SettingsStore {
  showOnlineUsers: boolean
  setShowOnlineUsers: (showOnlineUsers: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      showOnlineUsers: false,
      setShowOnlineUsers: showOnlineUsers => set({ showOnlineUsers }),
    }),
    {
      name: "settings-storage",
      partialize: state => ({
        showOnlineUsers: state.showOnlineUsers,
      }),
    },
  ),
)

interface OnlineUsersCountStore {
  count: number | null
  setCount: (count: number | null) => void
}

export const useOnlineUsersCountStore = create<OnlineUsersCountStore>()(set => ({
  count: null,
  setCount: count => set({ count }),
}))

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
