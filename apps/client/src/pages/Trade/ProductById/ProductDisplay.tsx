import type { StockDto } from "@repo/api-client/client"
import { cellRenderers } from "@repo/shared/lib"
import ProductForm from "./ProductForm"
import { ProductStatusFa } from "./ProductShared"

interface ProductDisplayProps {
  product: Required<StockDto>
}

export default function ProductDisplay({ product }: ProductDisplayProps) {
  // const { isDisabled } = useGetProductSideEnabled(product.status)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 text-xs text-center">
        <p>
          <span>وضعیت: </span>
          <span>{ProductStatusFa[product.status]}</span>
        </p>

        <p>
          <span>آخرین آپدیت: </span>
          <br />
          <span dir="ltr">
            <cellRenderers.DateAndTime value={product.dateUpdate} />
          </span>
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
