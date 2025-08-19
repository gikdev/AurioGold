import { useStocksQuery } from "../shared"
import { ProductFullCard } from "./ProductFullCard"

export function ProductFullCards() {
  const { data: stocks = [] } = useStocksQuery()

  return (
    <div className="gap-4 flex flex-col">
      {stocks.map(p => (
        <ProductFullCard product={p} key={p.id} />
      ))}
    </div>
  )
}
