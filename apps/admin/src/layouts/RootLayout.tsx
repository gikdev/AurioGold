import { currentThemeAtom } from "@repo/shared/atoms"
import { useAtomValue } from "jotai"
import { Outlet } from "react-router"

export default function RootLayout() {
  const currentTheme = useAtomValue(currentThemeAtom)

  return (
    <div
      data-theme={currentTheme}
      className="h-dvh bg-slate-3 text-slate-11 overflow-hidden flex flex-col p-2 gap-2"
    >
      <Outlet />
    </div>
  )
}
