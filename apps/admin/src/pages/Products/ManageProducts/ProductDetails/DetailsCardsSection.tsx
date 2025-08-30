import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { formatPersianPrice } from "@repo/shared/utils"
import { useStocksQuery } from "../shared"
import type { ProductId } from "../store"
import { usePriceUpdater } from "../usePriceUpdater"

interface DetailsCardsSectionProps {
  productId: ProductId
}

export function DetailsCardsSection({ productId }: DetailsCardsSectionProps) {
  const { data: stocks = [] } = useStocksQuery()
  const product = stocks.find(p => p.id === productId)

  const { change, areAllBtnsEnabled, isPending } = usePriceUpdater(product)

  if (!product || !productId) return null

  return (
    <div className="flex flex-col gap-2">
      <PriceCard
        label="اختلاف خرید (ریال)"
        value={product.diffBuyPrice}
        disabled={!areAllBtnsEnabled || isPending}
        onInc={() => change("diffBuyPrice", "inc")}
        onDec={() => change("diffBuyPrice", "dec")}
      />

      <PriceCard
        label="قیمت پایه (ریال)"
        value={product.price}
        disabled={!areAllBtnsEnabled || isPending}
        onInc={() => change("price", "inc")}
        onDec={() => change("price", "dec")}
      />

      <PriceCard
        label="اختلاف فروش (ریال)"
        value={product.diffSellPrice}
        disabled={!areAllBtnsEnabled || isPending}
        onInc={() => change("diffSellPrice", "inc")}
        onDec={() => change("diffSellPrice", "dec")}
      />
    </div>
  )
}

interface PriceCardProps {
  label: string
  value: number | null | undefined
  disabled?: boolean
  onInc: () => void
  onDec: () => void
}

function PriceCard({ label, value, disabled, onInc, onDec }: PriceCardProps) {
  return (
    <div className="bg-slate-2 border border-slate-6 rounded-md p-2 flex flex-col gap-5">
      <div className="flex items-center gap-1">
        <p className="me-auto">{label}</p>

        <Btn className="min-h-8 w-8 p-1" disabled={!!disabled} theme="error" onClick={onDec}>
          <CaretDownIcon size={20} />
        </Btn>

        <Btn className="min-h-8 w-8 p-1" disabled={!!disabled} theme="success" onClick={onInc}>
          <CaretUpIcon size={20} />
        </Btn>
      </div>

      <p className="font-bold text-2xl text-slate-12" dir="ltr">
        {formatPersianPrice(value ?? 0)}
      </p>
    </div>
  )
}
