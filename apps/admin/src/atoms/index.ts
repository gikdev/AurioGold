import { atom } from "jotai"

export const showOnlineUsersInStatusbarAtom = atom(true)

export const onlineUsersCountAtom = atom<"؟" | number>("؟")

export * from "./signalr"
export * from "./adminConnectivity"
