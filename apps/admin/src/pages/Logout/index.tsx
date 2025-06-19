import { SignOutIcon } from "@phosphor-icons/react"
import { currentThemeAtom } from "@repo/shared/atoms"
import { useAtomValue } from "jotai"
import { useEffect } from "react"
import { logout } from "#/atoms"

export default function Logout() {
  const currentTheme = useAtomValue(currentThemeAtom)

  useEffect(() => {
    logout()
  }, [])

  return (
    <div
      data-theme={currentTheme}
      className="bg-slate-1 text-slate-11 flex items-center justify-center rounded-md h-dvh"
    >
      <div className="flex text-center sm:text-start flex-col sm:flex-row items-center justify-center gap-2 animate-pulse p-2">
        <SignOutIcon size={64} className="text-red-9 block sm:hidden" />
        <SignOutIcon size={24} className="text-red-9 hidden sm:block" />
        <p>در حال خروج از حساب...</p>
      </div>
    </div>
  )
}
