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
import { useAtomValue } from "jotai"
import { motion } from "motion/react"
import { Link } from "react-router"
import { productsAtom } from "."
import { Navigation } from "./navigation"

export function ProductCards() {
  const products = useAtomValue(productsAtom)

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

export function calcA11yStuff(status: StockStatus) {
  switch (status) {
    case 0:
      return {
        classes: "text-slate-10",
        Icon: ProhibitIcon,
        name: "غیرفعال",
        title: "وضعیت دسترسی: غیرفعال",
      }

    case 1:
      return {
        classes: "text-green-10",
        Icon: ArrowRightIcon,
        name: "قابل خرید توسط مشتری",
        title: "وضعیت دسترسی: قابل خرید توسط مشتری",
      }

    case 2:
      return {
        classes: "text-red-10",
        Icon: ArrowLeftIcon,
        name: "قابل فروش توسط مشتری",
        title: "وضعیت دسترسی: قابل فروش توسط مشتری",
      }

    case 3:
      return {
        classes: "text-blue-10",
        Icon: ArrowsLeftRightIcon,
        name: "قابل خرید و فروش",
        title: "وضعیت دسترسی: قابل خرید و فروش",
      }

    default:
      return {
        Icon: QuestionIcon,
        classes: "text-slate-10",
        title: "؟؟؟",
        name: "؟؟؟",
      }
  }
}
