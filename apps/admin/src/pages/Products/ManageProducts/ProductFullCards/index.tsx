import type { StockDtoForMaster } from "@repo/api-client/client"
import { ProductFullCard } from "./ProductFullCard"

interface ProductFullCardsProps {
  stocks: StockDtoForMaster[]
}

export function ProductFullCards({ stocks }: ProductFullCardsProps) {
  return (
    <div className="gap-4 flex flex-col">
      {stocks.map(p => (
        <ProductFullCard product={p} key={p.id} />
      ))}
    </div>
  )
}
