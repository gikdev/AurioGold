import { useAtomValue } from "jotai"
import { productsAtom } from ".."
import { ProductFullCard } from "./ProductFullCard"

export function ProductFullCards() {
  const products = useAtomValue(productsAtom)

  return (
    <div className="gap-4 flex flex-col">
      {products.map(p => (
        <ProductFullCard product={p} key={p.id} />
      ))}
    </div>
  )
}
