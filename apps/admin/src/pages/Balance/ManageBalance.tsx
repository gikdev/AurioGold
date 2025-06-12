import { useApiRequest } from "@gikdev/react-datapi/src"
import { CoinsIcon, CopyIcon } from "@phosphor-icons/react"
import type { MasterPortfolioDto } from "@repo/api-client/client"
import { notifManager } from "@repo/shared/adapters"
import { BtnTemplates, FloatingActionBtn, TitledCard, useViewModes } from "@repo/shared/components"
import { useState } from "react"
import { v4 as uuid } from "uuid"
import BalanceTable from "./BalanceTable"
import PortfolioCards from "./PortfolioCards"

export interface MasterPortfolioWithId {
  id: string
  tyStockID: number
  stockName: string
  volume: number
}

function mapSinglePortfolioItem(item: MasterPortfolioDto): MasterPortfolioWithId {
  return {
    id: uuid(),
    stockName: item.stockName ?? "---",
    tyStockID: item.tyStockID ?? 0,
    volume: item.volume ?? 0,
  }
}

export default function ManageBalance() {
  const { renderedIconsToggle, viewMode } = useViewModes()
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<MasterPortfolioWithId["id"]>()
  const resBalance = useApiRequest<MasterPortfolioWithId[], MasterPortfolioDto[]>(() => ({
    url: "/Master/GetMasterPortfolio",
    defaultValue: [],
    transformResponse: rawItems => rawItems.map(mapSinglePortfolioItem),
  }))

  function handleCopyBtnClick() {
    const portfolioById = resBalance.data?.find(p => p.id === selectedPortfolioId)
    if (!portfolioById) return

    const valueToCopy = Math.abs(Number(portfolioById.volume.toFixed(3))).toString()

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

  const fabCopyBtn = viewMode === "cards" && (
    <FloatingActionBtn
      icon={CopyIcon}
      title="کپی انتخاب شده"
      onClick={handleCopyBtnClick}
      disabled={!selectedPortfolioId}
      fallback={
        <BtnTemplates.IconCopy
          onClick={handleCopyBtnClick}
          disabled={!selectedPortfolioId}
          title="کپی انتخاب شده"
        />
      }
    />
  )

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      {fabCopyBtn}

      <BtnTemplates.IconReload onClick={() => resBalance.reload()} />

      {renderedIconsToggle}
    </div>
  )

  return (
    <TitledCard title="مدیریت مانده حساب" icon={CoinsIcon} titleSlot={titledCardActions}>
      {resBalance.loading && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}

      {resBalance.success && !resBalance.loading && viewMode === "cards" && (
        <PortfolioCards
          portfolios={resBalance.data || []}
          selectedPortfolioId={selectedPortfolioId}
          setSelectedPortfolioId={setSelectedPortfolioId}
        />
      )}

      {resBalance.success && !resBalance.loading && viewMode === "table" && (
        <BalanceTable portfolios={resBalance.data || []} />
      )}
    </TitledCard>
  )
}
