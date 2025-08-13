import type { StockDtoForMaster } from "@repo/api-client/client"
import { calcA11yStuff } from "./calcA11yStuff"

interface A11yBtnProps {
  status: StockDtoForMaster["status"]
}

export function A11yBtn({ status }: A11yBtnProps) {
  const { Icon, classes, name } = calcA11yStuff(status)

  return (
    <button type="button" className="flex items-center gap-1 p-2 hover:bg-slate-4 cursor-pointer">
      <Icon size={16} className={classes} />
      <span>{name}</span>
    </button>
  )
}
