import { ArrowsDownUpIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { useTradeFormStore } from "../shared"

export default function RialModeToggle() {
  const mode = useTradeFormStore(s => s.mode)
  const setMode = useTradeFormStore(s => s.setMode)

  const handleToggleBtnClick = () => {
    setMode(mode === "rial" ? "weight" : "rial")
  }

  return (
    <Btn
      title="تعویض حالت"
      className={skins.btn({ className: "w-full" })}
      onClick={handleToggleBtnClick}
    >
      <ArrowsDownUpIcon size={20} />
      <span>تعویض حالت</span>
    </Btn>
  )
}
