import styled from "@master/styled.react"
import { TagIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client"
import { skins } from "@repo/shared/forms"
import { formatPersianPrice } from "@repo/shared/utils"
import { usePriceSourcesStore } from "../shared"

export const PriceSourceCards = ({ sources }: { sources: StockPriceSourceResponse[] }) => (
  <PriceSourceCardsContainer>
    {sources.map(s => (
      <PriceSourceCard key={s.id} id={s.id ?? 0} name={s.name ?? "---"} price={s.price ?? 0} />
    ))}
  </PriceSourceCardsContainer>
)

const PriceSourceCardsContainer = styled.div`
  grid auto-rows-fr gap-4
  grid-cols-[repeat(auto-fit,minmax(180px,1fr))]
`

interface PriceSourceCardProps {
  id: NonNullable<StockPriceSourceResponse["id"]>
  name: NonNullable<StockPriceSourceResponse["name"]>
  price: NonNullable<StockPriceSourceResponse["price"]>
}

function PriceSourceCard({ id, name, price }: PriceSourceCardProps) {
  return (
    <button
      type="button"
      onClick={() => usePriceSourcesStore.getState().details(id)}
      className={skins.btn({
        className: "flex flex-col p-2 min-w-max items-center gap-3 text-slate-11 h-auto",
      })}
    >
      <div className="flex justify-between flex-col w-full">
        <p className="flex-1 text-slate-12 font-bold text-start">{name}</p>

        <p
          className="decoration-slate-7 hover:decoration-slate-8 flex gap-1 items-center"
          dir="ltr"
        >
          <TagIcon />

          <span>{formatPersianPrice(price?.toString() || "")} ریال</span>
        </p>
      </div>
    </button>
  )
}
