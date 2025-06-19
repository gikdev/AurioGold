import styled from "@master/styled.react"
import { TagIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import { Btn } from "@repo/shared/components"
import { formatPersianPrice } from "@repo/shared/utils"
import { Link } from "react-router"
import { queryStateUrls } from "."

export const PriceSourceCardsContainer = styled.div`
  grid auto-rows-fr gap-4
  grid-cols-[repeat(auto-fit,minmax(180px,1fr))]
`

interface PriceSourceCardProps {
  id: NonNullable<StockPriceSourceResponse["id"]>
  name: NonNullable<StockPriceSourceResponse["name"]>
  price: NonNullable<StockPriceSourceResponse["price"]>
}

export function PriceSourceCard({ id, name, price }: PriceSourceCardProps) {
  return (
    <Btn
      as={Link}
      to={queryStateUrls.details(id)}
      type="button"
      data-testid="view-group-btn"
      className="flex flex-col p-2 min-w-max items-center gap-3 text-slate-11 h-auto"
    >
      <div className="flex justify-between flex-col w-full">
        <p className="flex-1 text-slate-12 font-bold">{name}</p>

        <p
          className="decoration-slate-7 hover:decoration-slate-8 flex gap-1 items-center"
          dir="ltr"
        >
          <TagIcon />

          <span>{formatPersianPrice(price?.toString() || "")}</span>
        </p>
      </div>
    </Btn>
  )
}
