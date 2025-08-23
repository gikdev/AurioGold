import { ArrowClockwiseIcon } from "@phosphor-icons/react"
import { skins } from "@repo/shared/forms"
import { parseError } from "@repo/shared/helpers"
import { createContext, type PropsWithChildren, use } from "react"
import { type SafeStock, useProductId, useStockByIdQuery } from "./shared"
import { useHandlePriceUpdate } from "./useHandlePriceUpdate"

const ProductContext = createContext<SafeStock | null>(null)

export function useProductContext() {
  const context = use(ProductContext)
  if (!context) throw new Error("Product context is null!")
  return context
}

export function ProductFetcher({ children }: PropsWithChildren) {
  const productId = useProductId()
  const { data, isPending, isSuccess, error, isError, refetch } = useStockByIdQuery(productId)

  useHandlePriceUpdate()

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center bg-red-2 border border-red-6 rounded-md w-full max-w-120 mx-auto ">
        <p className="text-lg font-medium text-red-10">یه مشکلی پیش اومده</p>

        <code dir="ltr" className="bg-black text-white py-2 px-4 block rounded-md w-max max-w-full">
          {parseError(error)}
        </code>

        <button
          type="button"
          onClick={() => refetch()}
          className={skins.btn({ intent: "error", style: "filled" })}
        >
          <ArrowClockwiseIcon />
          <span>امتحان دوباره</span>
        </button>
      </div>
    )

  if (isPending)
    return (
      <div className="bg-slate-5 rounded-md w-full max-w-120 mx-auto h-80 animate-pulse flex flex-col items-center justify-center" />
    )

  if (isSuccess) return <ProductContext value={data}>{children}</ProductContext>

  return null
}
