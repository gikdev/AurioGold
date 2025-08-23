import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Labeler } from "@repo/shared/components"
import { Link } from "react-router"
import routes from "#/pages/routes"
import { useProductContext } from "./ProductFetcher"

export function SelectedProduct() {
  const product = useProductContext()

  return (
    <Labeler labelText="محصول انتخاب‌شده:" titleSlot={<AllProductsLink />}>
      <p className="text-3xl font-bold text-slate-12 text-center">{product.name}</p>
    </Labeler>
  )
}

const AllProductsLink = () => (
  <Link
    to={routes.products}
    className="flex gap-1 items-center hover:text-brand-9 ms-auto transition-all"
  >
    <span>همه محصولات</span>
    <ArrowLeftIcon />
  </Link>
)
