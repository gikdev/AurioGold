import type { StockDtoForMaster } from "@repo/api-client/client"
import { A11yBtn } from "./A11yBtn"
import { CardHeader } from "./CardHeader"
import { PriceControllersContainer } from "./PriceControllersContainer"
import { PriceHr } from "./PriceControllersContainer/PriceHr"
import { UpdateDate } from "./UpdateDate"

interface ProductFullCardProps {
  product: StockDtoForMaster
}

export function ProductFullCard({ product: p }: ProductFullCardProps) {
  return (
    <div className="bg-slate-3 border rounded-md flex flex-col border-slate-7 overflow-hidden">
      <CardHeader id={p.id ?? 0} name={p.name ?? ""} />

      <div className="text-xs flex justify-between items-center flex-wrap">
        <A11yBtn status={p.status} />

        <UpdateDate dateUpdate={p.dateUpdate} />
      </div>

      <PriceHr />

      <PriceControllersContainer
        diffBuyPrice={p.diffBuyPrice}
        diffSellPrice={p.diffSellPrice}
        price={p.price}
        id={p.id}
      />
    </div>
  )
}
