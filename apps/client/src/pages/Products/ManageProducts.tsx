import type { StockDto } from "@repo/api-client/client"
import { getApiTyStocksForCustommerOptions } from "@repo/api-client/tanstack"
import { LoadingSpinner } from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { atom } from "jotai"
import { getHeaderTokenOnly } from "#/shared"
import { ProductCard } from "./ProductCard"
import ShowIfStoreOnline from "./ShowIfStoreOnline"

export const productsAtom = atom<Required<StockDto>[] | null>(null)

export default function ManageProducts() {
  const { data: products = [], status } = useQuery(
    getApiTyStocksForCustommerOptions(getHeaderTokenOnly()),
  )

  return (
    <ShowIfStoreOnline>
      <div className="flex flex-wrap gap-3 max-w-160 w-full mx-auto">
        {status === "success" && products.length === 0 && <p>هنوز محصولی نداریم...</p>}
        {status === "pending" && <LoadingSpinner className="block mx-auto" />}
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </ShowIfStoreOnline>
  )
}
