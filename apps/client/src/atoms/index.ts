import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const showOnlineUsersInStatusbarAtom = atomWithStorage(
  "SHOW_ONLINE_USERS_IN_STATUSBAR",
  true,
)

export const onlineUsersCountAtom = atom<"؟" | number>("؟")

export * from "./signalr"
export * from "./adminConnectivity"
