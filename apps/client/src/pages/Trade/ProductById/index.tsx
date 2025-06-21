import { useApiRequest } from "@gikdev/react-datapi/src"
import { PackageIcon } from "@phosphor-icons/react"
import type { StockDto } from "@repo/api-client/client"
import { Btn, ErrorPage, LoadingSpinner } from "@repo/shared/components"
import { HeadingLine } from "@repo/shared/layouts"
import { Link, useParams } from "react-router"
import routes from "#/pages/routes"
import { transformStock } from "../ManageProducts"
import ShowIfStoreOnline from "../ShowIfStoreOnline"
import ProductDisplay from "./ProductDisplay"

export default function ProductById() {
  const params = useParams()
  const productId = Number.isNaN(Number(params.productId)) ? null : Number(params.productId)

  const resProduct = useApiRequest<Required<StockDto> | null, StockDto>(() => ({
    url: `/TyStocks/ForCustommer/${productId}`,
    defaultValue: null,
    shouldRun: () => productId != null,
    transformResponse: transformStock,
    dependencies: [productId],
  }))

  if (
    !resProduct.data ||
    (!resProduct.loading && resProduct.data == null) ||
    typeof productId !== "number"
  )
    return (
      <ErrorPage
        title="پیدا نشد!"
        description="محصول مورد نظر شما پیدا نشد! لطفا دوباره محصول را انتخاب کنید"
      >
        <Btn theme="info" themeType="filled" as={Link} to={routes.trade}>
          <PackageIcon size={20} />
          <span>انتخاب دوباره</span>
        </Btn>
      </ErrorPage>
    )

  const product = resProduct.data

  return (
    <HeadingLine title={`${resProduct.data?.name || "---"}`}>
      <ShowIfStoreOnline>
        {resProduct.loading && <LoadingSpinner className="mx-auto block" />}
        <ProductDisplay product={product} />
      </ShowIfStoreOnline>
    </HeadingLine>
  )
}
