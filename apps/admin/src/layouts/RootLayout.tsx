import { currentThemeAtom } from "@repo/shared/atoms"
import { useAtomValue } from "jotai"
import { Outlet } from "react-router"
import { usePrefersTheme } from "react-haiku"

export default function RootLayout() {
  const currentTheme = useAtomValue(currentThemeAtom)
  const preferredTheme = usePrefersTheme(currentTheme)

  return (
    <div
      data-theme={preferredTheme}
      className="h-dvh bg-slate-3 text-slate-11 overflow-hidden flex flex-col p-2 gap-2"
    >
      <Outlet />
    </div>
  )
}
