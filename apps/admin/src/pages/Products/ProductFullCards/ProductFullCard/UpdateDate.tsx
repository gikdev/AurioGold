import type { StockDtoForMaster } from "@repo/api-client/client"
import { cellRenderers } from "@repo/shared/lib"

interface UpdateDateProps {
  dateUpdate: StockDtoForMaster["dateUpdate"]
}

export function UpdateDate({ dateUpdate = new Date(0).toISOString() }: UpdateDateProps) {
  return (
    <time dir="ltr" className="p-2">
      <cellRenderers.DateAndTime value={dateUpdate} />
    </time>
  )
}
