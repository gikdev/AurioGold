import { CopyIcon, PackageIcon } from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { skins } from "@repo/shared/forms"
import { cn } from "@repo/shared/helpers"
import { formatPersianPrice } from "@repo/shared/utils"
import type { PortfolioWithId } from "./ManageBalance"

interface PortfolioCardsProps {
  portfolios: PortfolioWithId[]
}

export default function PortfolioCards({ portfolios }: PortfolioCardsProps) {
  return (
    <div className="grid auto-rows-fr gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
      {portfolios.map(p => (
        <PortfolioCard key={p.id} stockName={p.stockName} volume={p.volume ?? 0} />
      ))}
    </div>
  )
}

interface PortfolioCardProps {
  stockName: PortfolioWithId["stockName"]
  volume: NonNullable<PortfolioWithId["volume"]>
}

function PortfolioCard({ stockName, volume }: PortfolioCardProps) {
  return (
    <div className="bg-slate-3 rounded-md p-4 flex flex-col gap-5 min-w-40 border-slate-7">
      <div className="flex items-start gap-1">
        <PackageIcon size={20} />
        <span>{stockName}</span>

        <span className={cn("ms-auto text-xs", volume >= 0 ? "text-green-10" : "text-red-10")}>
          ({volume >= 0 ? "بستانکار" : "بدهکار"})
        </span>
      </div>

      <div className="flex justify-between items-end flex-wrap">
        <button
          type="button"
          onClick={() => copyVolume(volume)}
          className={skins.btn({ isIcon: true })}
        >
          <CopyIcon />
        </button>

        <span dir="ltr" className="font-bold text-2xl text-slate-12">
          {formatPersianPrice(Math.abs(Number(volume.toFixed(3))))}
        </span>
      </div>
    </div>
  )
}

function copyVolume(volume: NonNullable<PortfolioWithId["volume"]>) {
  const valueToCopy = Math.abs(Number(volume.toFixed(3))).toString()

  if (!navigator.clipboard || !window.isSecureContext) {
    notifManager.notify("برای کپی کردن، لطفاً از HTTPS استفاده کنید", "toast", {
      status: "warning",
    })
    return
  }

  navigator.clipboard
    .writeText(valueToCopy)
    .then(() => notifManager.notify("کپی شد!", "toast", { status: "success" }))
    .catch(() =>
      notifManager.notify("یه اروری موقع کپی کردن پیش آمد...", "toast", { status: "error" }),
    )
}
