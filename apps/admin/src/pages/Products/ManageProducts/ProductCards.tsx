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
import { useProductsStore } from "./store"

interface ProductCardsProps {
  stocks: StockDtoForMaster[]
}

export function ProductCards({ stocks }: ProductCardsProps) {
  return (
    <div className="grid auto-rows-fr gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {stocks.map(s => (
        <ProductCard product={s} key={s.id} />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: StockDtoForMaster
}

function ProductCard({ product: p }: ProductCardProps) {
  const a11yStuff = calcA11yStuff(p.status)

  function handleClick() {
    if (typeof p.id !== "number") return
    useProductsStore.getState().details(p.id)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-slate-3 hover:bg-slate-4 border rounded-md p-2 flex flex-col gap-5 cursor-pointer border-slate-7 hover:border-slate-8"
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
          {formatPersianPrice(p.price ?? 0)} ریال
        </span>
      </p>
    </button>
  )
}

export function calcA11yStuff(status: StockStatus | undefined) {
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
