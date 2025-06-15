import styled from "@master/styled.react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsLeftRightIcon,
  CaretLeftIcon,
  PackageIcon,
  ProhibitIcon,
  QuestionIcon,
} from "@phosphor-icons/react"
import type { StockDtoForMaster, StockStatus } from "@repo/api-client/client"
import { formatPersianPrice } from "@repo/shared/utils"
import { motion } from "motion/react"
import { Link } from "react-router"
import { Navigation } from "./navigation"

interface ProductCardsProps {
  products: Required<StockDtoForMaster>[]
}

export function ProductCards({ products }: ProductCardsProps) {
  return (
    <div className="grid auto-rows-fr gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {products.map(p => (
        <ProductCard product={p} key={p.id} />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Required<StockDtoForMaster>
}

function ProductCard({ product: p }: ProductCardProps) {
  const StyledMotionLink = styled(motion.create(Link))`
    bg-slate-3 hover:bg-slate-4 border rounded-md
    p-2 flex flex-col gap-5 cursor-pointer
    border-slate-7 hover:border-slate-8
  `
  const a11yStuff = calcA11yStuff(p.status)

  return (
    <StyledMotionLink
      to={Navigation.details(p.id!)}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
    >
      <p className="flex items-center gap-1">
        <PackageIcon size={20} />
        <span>{p.name}</span>

        <CaretLeftIcon className="ms-auto" />
      </p>

      <p className="flex justify-between items-center flex-wrap">
        <abbr className="contents" title={a11yStuff.title}>
          <a11yStuff.Icon className={a11yStuff.classes} />
        </abbr>

        <span dir="ltr" className="font-bold text-lg text-slate-12">
          {formatPersianPrice(p.price ?? 0)}
        </span>
      </p>
    </StyledMotionLink>
  )
}

function calcA11yStuff(status: StockStatus) {
  let Icon = QuestionIcon
  let classes = "text-slate-10"
  let title = "؟؟؟"

  if (status === 0) Icon = ProhibitIcon
  if (status === 1) Icon = ArrowRightIcon
  if (status === 2) Icon = ArrowLeftIcon
  if (status === 3) Icon = ArrowsLeftRightIcon

  if (status === 0) classes = "text-slate-10"
  if (status === 1) classes = "text-green-10"
  if (status === 2) classes = "text-red-10"
  if (status === 3) classes = "text-blue-10"

  if (status === 0) title = "وضعیت دسترسی: غیرفعال"
  if (status === 1) title = "وضعیت دسترسی: قابل خرید توسط مشتری"
  if (status === 2) title = "وضعیت دسترسی: قابل فروش توسط مشتری"
  if (status === 3) title = "وضعیت دسترسی: قابل خرید و فروش"

  return { Icon, classes, title }
}
