import { PackageIcon, ReceiptIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { Link } from "react-router"
import routes from "#/pages/routes"
import type { OrderModalState } from "./stuff"

interface BtnsProps {
  modalState: OrderModalState
}

export function Btns({ modalState }: BtnsProps) {
  if (modalState === "no-answer") return <AllOrdersBtn />

  if (["agreed", "disagreed", "error"].includes(modalState))
    return (
      <>
        <ProductsBtn />
        <OrdersBtn />
      </>
    )

  return null
}

const AllOrdersBtn = () => (
  <Btn className="col-span-2" as={Link} to={routes.orders} theme="primary" themeType="filled">
    <ReceiptIcon size={20} />
    <span>همه سفارشات</span>
  </Btn>
)

const ProductsBtn = () => (
  <Btn as={Link} to={routes.products}>
    <PackageIcon size={20} />
    <span>محصولات</span>
  </Btn>
)

const OrdersBtn = () => (
  <Btn as={Link} to={routes.orders}>
    <ReceiptIcon size={20} />
    <span>سفارشات</span>
  </Btn>
)
