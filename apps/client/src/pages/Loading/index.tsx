import { CircleNotchIcon } from "@phosphor-icons/react"
import { currentThemeAtom } from "@repo/shared/atoms"
import { useAtomValue } from "jotai"

export default function Loading() {
  const currentTheme = useAtomValue(currentThemeAtom)

  return (
    <div
      data-theme={currentTheme}
      className="bg-slate-1 text-slate-11 min-h-dvh flex flex-col items-center justify-center gap-2"
    >
      <CircleNotchIcon size={64} className="text-amber-9 animate-spin" />
      <p className="animate-pulse">در حال بارگذاری...</p>
    </div>
  )
}
