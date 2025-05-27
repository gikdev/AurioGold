import { currentThemeAtom } from "@repo/shared/atoms"
import { Btn } from "@repo/shared/components"
import { useAtomValue } from "jotai"

export default function Home() {
  const currentTheme = useAtomValue(currentThemeAtom)

  return (
    <div data-theme={currentTheme} className="min-h-dvh bg-slate-1">
      <Btn type="button">سلام به همگی!</Btn>
    </div>
  )
}
