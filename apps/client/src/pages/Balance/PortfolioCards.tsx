import { PackageIcon } from "@phosphor-icons/react"
import { Radio } from "@repo/shared/components"
import { cn } from "@repo/shared/helpers"
import { formatPersianPrice } from "@repo/shared/utils"
import { motion } from "motion/react"
import type { PortfolioWithId } from "./ManageBalance"

interface PortfolioCardsProps {
  portfolios: PortfolioWithId[]
  selectedPortfolioId: PortfolioWithId["id"] | undefined
  setSelectedPortfolioId: (val: PortfolioWithId["id"] | undefined) => void
}

export default function PortfolioCards({
  portfolios,
  selectedPortfolioId,
  setSelectedPortfolioId,
}: PortfolioCardsProps) {
  return (
    <div className="flex flex-wrap *:flex-1 gap-5">
      {portfolios.map(p => (
        <PortfolioCard
          key={p.id}
          id={p.id}
          selectedPortfolioId={selectedPortfolioId}
          setSelectedPortfolioId={setSelectedPortfolioId}
          stockName={p.stockName}
          volume={p.volume}
        />
      ))}
    </div>
  )
}

interface PortfolioCardProps {
  id: PortfolioWithId["id"]
  stockName: PortfolioWithId["stockName"]
  volume: PortfolioWithId["volume"]
  selectedPortfolioId: PortfolioWithId["id"] | undefined
  setSelectedPortfolioId: (val: PortfolioWithId["id"]) => void
}

function PortfolioCard({
  id,
  stockName,
  volume,
  selectedPortfolioId,
  setSelectedPortfolioId,
}: PortfolioCardProps) {
  const isSelected = selectedPortfolioId === id

  return (
    <motion.label
      initial={{ scale: 1 }}
      animate={{ scale: isSelected ? 1.02 : 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "bg-slate-3 hover:bg-slate-4 border rounded-md p-2 flex flex-col gap-5 min-w-40 cursor-pointer ",
        isSelected ? "border-brand-9 hover:border-brand-10" : "border-slate-7 hover:border-slate-8",
      )}
    >
      <p className="flex items-center gap-1">
        <PackageIcon size={20} />
        <span>{stockName}</span>
      </p>

      <p dir="ltr" className="font-bold text-lg text-slate-12">
        {formatPersianPrice(Math.abs(Number(volume.toFixed(3))))}
      </p>

      <p className="flex justify-between items-center flex-wrap">
        <span className={cn("text-xs", volume >= 0 ? "text-green-10" : "text-red-10")}>
          ({volume >= 0 ? "بستانکار" : "بدهکار"})
        </span>

        <Radio
          className="ms-auto"
          checked={isSelected}
          onChange={() => setSelectedPortfolioId(id)}
        />
      </p>
    </motion.label>
  )
}
