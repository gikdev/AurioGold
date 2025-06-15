import { CirclesThreePlusIcon } from "@phosphor-icons/react"
import { BtnTemplates, FloatingActionBtn, ViewModesToggle } from "@repo/shared/components"
import { HeadingLine } from "@repo/shared/layouts"
import { Navigation } from "./navigation"
import { Link } from "react-router"
import ManageProducts from "./ManageProducts"

export default function Products() {
  const actions = (
    <div className="ms-auto flex items-center gap-2">
      <ViewModesToggle />
      <CreateProductFAB />
    </div>
  )

  return (
    <HeadingLine title="مدیریت محصولات" actions={actions}>
      <ManageProducts />
    </HeadingLine>
  )
}

const CreateProductFAB = () => (
  <FloatingActionBtn
    title="ایجاد محصول جدید"
    icon={CirclesThreePlusIcon}
    to={Navigation.createNew()}
    theme="success"
    fallback={<BtnTemplates.Create as={Link} to={Navigation.createNew()} themeType="filled" />}
  />
)
