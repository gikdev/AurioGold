import styled from "@master/styled.react"
import type { CustomerGroupDto, CustomerGroupIntDto } from "@repo/api-client/client"
import { Btn } from "@repo/shared/components"
import { formatPersianPrice } from "@repo/shared/utils"
import { Link } from "react-router"

export const GroupCardsContainer = styled.div`
  flex flex-wrap gap-4
`

interface GroupCardProps {
  id: NonNullable<CustomerGroupDto["id"]> & NonNullable<CustomerGroupIntDto["id"]>
  name: string
  diffBuyPrice: number
  diffSellPrice: number
  details(id: number): string
}

export function GroupCard({ diffBuyPrice, diffSellPrice, id, name, details }: GroupCardProps) {
  return (
    <Btn
      as={Link}
      to={details(id)}
      className="flex flex-1 flex-wrap p-2 flex-col items-center text-center gap-3 text-slate-11 h-auto min-w-24"
    >
      <p className="flex-1 text-slate-12 font-bold">{name}</p>

      <abbr
        title="اختلاف قیمت خرید مشتری"
        dir="ltr"
        className="text-green-10 decoration-slate-7 hover:decoration-slate-8 text-xs"
      >
        {formatPersianPrice(diffBuyPrice?.toString() || "")}
      </abbr>

      <abbr
        title="اختلاف قیمت فروش مشتری"
        dir="ltr"
        className="text-red-10 decoration-slate-7 hover:decoration-slate-8 text-xs"
      >
        {formatPersianPrice(diffSellPrice?.toString() || "")}
      </abbr>
    </Btn>
  )
}
