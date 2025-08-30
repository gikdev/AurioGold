import styled from "@master/styled.react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import { ErrorCardBoundary } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { formatPersianPrice } from "@repo/shared/utils"
import { useGramGroupsStore } from "../shared"

interface GroupCardsProps {
  groups: CustomerGroupDto[]
}

export function GroupCards({ groups }: GroupCardsProps) {
  return (
    <ErrorCardBoundary>
      <GroupCardsContainer>
        {groups.map(g => (
          <GroupCard
            key={g.id}
            diffBuyPrice={g.diffBuyPrice ?? 0}
            diffSellPrice={g.diffSellPrice ?? 0}
            name={g.name ?? "---"}
            onClick={() => {
              if (typeof g.id !== "number") return
              useGramGroupsStore.getState().details(g.id)
            }}
          />
        ))}
      </GroupCardsContainer>
    </ErrorCardBoundary>
  )
}

const GroupCardsContainer = styled.div`
  flex flex-wrap gap-4
`

interface GroupCardProps {
  name: string
  diffBuyPrice: number
  diffSellPrice: number
  onClick: () => void
}

function GroupCard({ diffBuyPrice, diffSellPrice, name, onClick }: GroupCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={skins.btn({
        className: `
          flex flex-1 flex-wrap p-2 flex-col items-center
          text-center gap-3 text-slate-11 h-auto min-w-24
        `,
      })}
    >
      <p className="flex-1 text-slate-12 font-bold">{name}</p>

      <abbr
        dir="ltr"
        title="اختلاف قیمت خرید مشتری"
        className="text-green-10 decoration-slate-7 hover:decoration-slate-8 text-xs"
      >
        {formatPersianPrice(diffBuyPrice?.toString() || "")} ریال
      </abbr>

      <abbr
        dir="ltr"
        title="اختلاف قیمت فروش مشتری"
        className="text-red-10 decoration-slate-7 hover:decoration-slate-8 text-xs"
      >
        {formatPersianPrice(diffSellPrice?.toString() || "")} ریال
      </abbr>
    </button>
  )
}
