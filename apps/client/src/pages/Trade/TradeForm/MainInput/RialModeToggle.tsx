import { ArrowsLeftRightIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { ccn } from "@repo/shared/helpers"
import { useBooleanishQueryState } from "@repo/shared/hooks"
import { QUERY_KEYS } from "../../navigation"

export default function RialModeToggle() {
  const [_isRialMode, setRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)

  const handleToggleBtnClick = () => {
    setRialMode(r => !r)
  }

  return (
    <Btn title="تعویض حالت" {...styles.toggleBtn} onClick={handleToggleBtnClick}>
      <ArrowsLeftRightIcon size={20} />
    </Btn>
  )
}

const styles = {
  toggleBtn: ccn(`
    min-w-8 min-h-8 p-0 border-transparent
    bg-transparent hover:bg-slate-3
  `),
}
