import { useApiRequest } from "@gikdev/react-datapi/src"
import type { StockDto } from "@repo/api-client/client"
import { LoadingSpinner } from "@repo/shared/components"
import { atom } from "jotai"
import ProductCard from "./ProductCard"
import ShowIfStoreOnline from "./ShowIfStoreOnline"
import { transformStock } from "./transformStock"

export const productsAtom = atom<Required<StockDto>[] | null>(null)

export default function ManageProducts() {
  const resProducts = useApiRequest<Required<StockDto>[] | null, StockDto[]>(() => ({
    url: "/TyStocks/ForCustommer",
    defaultValue: null,
    transformResponse: rawItems => rawItems.map(transformStock),
  }))

  return (
    <ShowIfStoreOnline>
      <div className="flex flex-wrap gap-3 max-w-160 w-full mx-auto">
        {!resProducts.loading && resProducts.data?.length === 0 && <p>هنوز محصولی نداریم...</p>}
        {resProducts.loading && <LoadingSpinner className="block mx-auto" />}
        {resProducts.data?.map(p => (
          <ProductCard
            key={p.id}
            name={p.name ?? "---"}
            updateDate={p.dateUpdate}
            productId={p.id}
            status={p.status}
          />
        ))}
      </div>
    </ShowIfStoreOnline>
  )
}
