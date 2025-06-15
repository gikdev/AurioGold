import { CaretLeftIcon, PackageIcon } from "@phosphor-icons/react"
import { cn } from "@repo/shared/helpers"
import { formatPersianPrice } from "@repo/shared/utils"
import { motion } from "motion/react"
import { Link } from "react-router"
import type { UserBalanceItemWithId } from "./CustomerBalanceDrawer"
import { CustomerNavigation } from "./navigation"

interface BalanceCardsProps {
  balanceItems: UserBalanceItemWithId[]
}

export default function BalanceCards({ balanceItems }: BalanceCardsProps) {
  return (
    <div className="grid auto-rows-fr gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
      {balanceItems.map(p => (
        <BalanceCard
          key={p.id}
          stockName={p.stockName}
          volume={p.volume}
          customerId={p.customerId}
          stockId={p.stockId}
        />
      ))}
    </div>
  )
}

interface BalanceCardProps {
  stockName: UserBalanceItemWithId["stockName"]
  customerId: UserBalanceItemWithId["customerId"]
  stockId: UserBalanceItemWithId["stockId"]
  volume: UserBalanceItemWithId["volume"]
}

function BalanceCard({ stockName, volume, stockId, customerId }: BalanceCardProps) {
  const MotionLink = motion.create(Link)

  const to =
    stockId === 0
      ? CustomerNavigation.doc(customerId)
      : CustomerNavigation.transfer(customerId, stockId, "0912912912912")

  return (
    <MotionLink
      to={to}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className="bg-slate-3 hover:bg-slate-4 border rounded-md p-2 flex flex-col gap-5 min-w-max cursor-pointer border-slate-7 hover:border-slate-8"
    >
      <p className="flex items-center gap-1">
        <PackageIcon size={20} />
        <span>{stockName}</span>

        <CaretLeftIcon className="ms-auto" />
      </p>

      <p className="flex justify-between items-center flex-wrap">
        <span className={cn("text-xs", volume >= 0 ? "text-green-10" : "text-red-10")}>
          ({volume >= 0 ? "بستانکار" : "بدهکار"})
        </span>

        <span dir="ltr" className="font-bold text-lg text-slate-12">
          {formatPersianPrice(Math.abs(Number(volume.toFixed(3))))}
        </span>
      </p>
    </MotionLink>
  )
}
