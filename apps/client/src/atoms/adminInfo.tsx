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
  name: null,
  rulls: null,
  aboutUs: null,
  logoUrl: null,
  mainPage: null,
  status: 0,
}

export const adminInfoAtom = atomWithStorage("ADMIN_INFO", {})
