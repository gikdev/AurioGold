import { useApiRequest } from "@gikdev/react-datapi/src"
import type { StockDto } from "@repo/api-client/client"
import { LoadingSpinner } from "@repo/shared/components"
import { atom } from "jotai"
import ProductCard from "./ProductCard"
import ShowIfStoreOnline from "./ShowIfStoreOnline"

export function transformStock(input: StockDto): Required<StockDto> {
  // if server answers nothing, or a message, this will throw an error to say that server had error!
  if (typeof input === "string") throw new Error("WHat are yu doing?")

  return {
    id: input.id ?? 0,
    name: input.name || "---",
    description: input.description || null,
    price: input.price ?? null,
    diffBuyPrice: input.diffBuyPrice ?? null,
    diffSellPrice: input.diffSellPrice ?? null,
    priceStep: input.priceStep ?? null,
    diffPriceStep: input.diffPriceStep ?? null,
    status: input.status ?? 0,
    mode: input.mode ?? 0,
    maxAutoMin: input.maxAutoMin ?? null,
    dateUpdate: input.dateUpdate ?? new Date(0).toISOString(),
    minValue: input.minValue ?? null,
    maxValue: input.maxValue ?? null,
    minVoume: input.minVoume ?? 0,
    maxVoume: input.maxVoume ?? 0,
    isCountable: input.isCountable ?? false,
    unitPriceRatio: input.unitPriceRatio ?? 0,
    decimalNumber: input.decimalNumber ?? 0,
    supply: input.supply ?? 0,
    priceSourceID: input.priceSourceID ?? null,
    unit: input.unit ?? 0,
  }
}

export const productsAtom = atom<Required<StockDto>[] | null>(null)

export default function ManageProducts() {
  const resProducts = useApiRequest<Required<StockDto>[] | null, StockDto[]>(() => ({
    url: "/TyStocks/ForCustommer",
    defaultValue: null,
    transformResponse: rawItems => rawItems.map(transformStock),
  }))

  return (
    <ShowIfStoreOnline>
      <div className="flex flex-wrap flex-col *:flex-1 gap-3">
        {!resProducts.loading && resProducts.data?.length === 0 && <p>هنوز محصولی نداریم...</p>}
        {resProducts.loading && <LoadingSpinner className="block mx-auto" />}
        {resProducts.data?.map(p => (
          <ProductCard
            key={p.id}
            name={p.name ?? "---"}
            diffSellPrice={p.diffBuyPrice ?? 0}
            diffBuyPrice={p.diffSellPrice ?? 0}
            productId={p.id}
            basePrice={p.price ?? 0}
            status={p.status}
            unit={p.unit}
          />
        ))}
      </div>
    </ShowIfStoreOnline>
  )
}
