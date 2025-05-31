import { currentThemeAtom } from "@repo/shared/atoms"
import { useAtomValue } from "jotai"
import { Outlet } from "react-router"

export default function RootLayout() {
  const currentTheme = useAtomValue(currentThemeAtom)

  return (
    <div data-theme={currentTheme} className="min-h-dvh bg-slate-1 text-slate-11 flex flex-col">
      <Outlet />
    </div>
  )
}
