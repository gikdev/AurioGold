import { atom } from "jotai"

export const isSidebarOpenAtom = atom(false)

export type Theme = "dark" | "light"
export const currentThemeAtom = atom<Theme>("dark" satisfies Theme)
