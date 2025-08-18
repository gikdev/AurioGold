import { CoinsIcon, CopyIcon } from "@phosphor-icons/react"
import type { MasterPortfolioDto } from "@repo/api-client/client"
import { getApiMasterGetMasterPortfolioOptions } from "@repo/api-client/tanstack"
import { notifManager } from "@repo/shared/adapters"
import { BtnTemplates, FloatingActionBtn, TitledCard, useViewModes } from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { v4 as uuid } from "uuid"
import { getHeaderTokenOnly } from "../Products/shared"
import BalanceTable from "./BalanceTable"
import PortfolioCards from "./PortfolioCards"

export interface MasterPortfolioWithId extends MasterPortfolioDto {
  id: string
}

function addIds(items: MasterPortfolioDto[]): MasterPortfolioWithId[] {
  return items.map(i => ({ ...i, id: uuid() }))
}

export const useMasterBalanceQuery = () =>
  useQuery({
    ...getApiMasterGetMasterPortfolioOptions(getHeaderTokenOnly()),
    select: addIds,
  })

export default function ManageBalance() {
  const { renderedIconsToggle, viewMode } = useViewModes()
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<MasterPortfolioWithId["id"]>()

  const { data: balance = [], isPending, isSuccess, refetch } = useMasterBalanceQuery()

  function handleCopyBtnClick() {
    const portfolioById = balance.find(p => p.id === selectedPortfolioId)
    if (!portfolioById) return
    if (typeof portfolioById.volume !== "number") return

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

      <BtnTemplates.IconReload onClick={() => refetch()} />

      {renderedIconsToggle}
    </div>
  )

  return (
    <TitledCard title="مدیریت مانده حساب" icon={CoinsIcon} titleSlot={titledCardActions}>
      {isPending && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}

      {isSuccess && viewMode === "cards" && (
        <PortfolioCards
          portfolios={balance}
          selectedPortfolioId={selectedPortfolioId}
          setSelectedPortfolioId={setSelectedPortfolioId}
        />
      )}

      {isSuccess && viewMode === "table" && <BalanceTable portfolios={balance} />}
    </TitledCard>
  )
}
