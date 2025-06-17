import { atom } from "jotai"

export const isSidebarOpenAtom = atom(false)

export type Theme = "dark" | "light" | "auto"
export const currentThemeAtom = atom<Theme>("auto" satisfies Theme)
