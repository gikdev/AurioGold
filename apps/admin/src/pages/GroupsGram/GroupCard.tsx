import styled from "@master/styled.react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import { Btn } from "@repo/shared/components"
import { formatPersianPrice } from "@repo/shared/utils"
import { Link } from "react-router"
import { queryStateUrls } from "."

export const GroupCardsContainer = styled.div`
  grid auto-rows-fr gap-4
  grid-cols-[repeat(auto-fit,minmax(150px,1fr))]
`

interface GroupCardProps {
  id: CustomerGroupDto["id"]
  name: CustomerGroupDto["name"]
  diffBuyPrice: CustomerGroupDto["diffBuyPrice"]
  diffSellPrice: CustomerGroupDto["diffSellPrice"]
}

export function GroupCard({ diffBuyPrice, diffSellPrice, id, name }: GroupCardProps) {
  return (
    <Btn
      as={Link}
      to={queryStateUrls.details(id)}
      type="button"
      data-testid="view-group-btn"
      className="flex p-2 min-w-max items-center gap-3 text-slate-11 h-auto"
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
