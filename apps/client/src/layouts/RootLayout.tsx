import { currentThemeAtom } from "@repo/shared/atoms"
import { useAtomValue } from "jotai"
import { usePrefersTheme } from "react-haiku"
import { Outlet } from "react-router"

export default function RootLayout() {
  const currentTheme = useAtomValue(currentThemeAtom)
  const preferredTheme = usePrefersTheme("dark")

  return (
    <div
      data-theme={currentTheme === "auto" ? preferredTheme : currentTheme}
      className="h-dvh bg-slate-3 text-slate-11 overflow-hidden flex flex-col p-2 gap-2 fixed inset-0"
    >
      <Outlet />
    </div>
  )
}
