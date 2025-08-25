import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export interface AdminInfo {
  id: number
  name: string | null
  rulls: string | null
  aboutUs: string | null
  logoUrl: string | null
  mainPage: string | null
  status: number
}

export const emptyAdminInfo: AdminInfo = {
  id: 0,
  name: "---",
  rulls: null,
  aboutUs: null,
  logoUrl: null,
  mainPage: null,
  status: 0,
}

export const adminInfoAtom = atomWithStorage<AdminInfo>("ADMIN_INFO", emptyAdminInfo)

export const isAdminOnlineAtom = atom(
  get => get(adminInfoAtom).status === AdminStatus.Online,
  (get, set, newValue: boolean) =>
    set(adminInfoAtom, {
      ...get(adminInfoAtom),
      status: newValue ? AdminStatus.Online : AdminStatus.Offline,
    }),
)

export const AdminStatus = {
  Offline: 1,
  Online: 2,
  Disabled: 3,
} as const
