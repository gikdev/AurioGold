import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const isSidebarOpenAtom = atom(false)

export type Theme = "dark" | "light"
export const currentThemeAtom = atomWithStorage<Theme>("THEME", "dark" satisfies Theme)
