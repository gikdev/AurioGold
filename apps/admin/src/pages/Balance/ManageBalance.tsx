import { CoinsIcon, CopyIcon } from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import {
  Btn,
  BtnTemplates,
  FloatingActionBtn,
  Heading,
  Hr,
  TitledCard,
  useViewModes,
} from "@repo/shared/components"
import { useAtomValue } from "jotai"
import BalanceTable from "./BalanceTable"
import PortfolioCards from "./PortfolioCards"
import {
  type MasterPortfolioWithId,
  selectedPortfolioIdAtom,
  useGetMasterPortfolioQuery,
} from "./shared"

export default function ManageBalance() {
  const { renderedIconsToggle, viewMode } = useViewModes()

  const { data: balance = [], status, refetch } = useGetMasterPortfolioQuery()

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      {viewMode === "cards" && <CopyBtn balance={balance} />}

      <BtnTemplates.IconReload onClick={() => refetch()} />

      {renderedIconsToggle}
    </div>
  )

  return (
    <TitledCard title="مدیریت مانده حساب" icon={CoinsIcon} titleSlot={titledCardActions}>
      {status === "error" && (
        <div className="bg-red-2 border-2 border-red-6 p-4 flex flex-col gap-4 text-red-11 rounded-lg max-w-72 text-center mx-auto my-2">
          <Heading as="h2" size={2}>
            خطا!
          </Heading>
          <Hr className="bg-red-6" />
          <p>
            یه مشکلی پیش اومده و به احتمال زیاد تقصیر ماست. لطفا دوباره امتحان کنید یا با مسئول
            مربوطه تماس بگیرید.
          </p>
          <Btn onClick={() => refetch()}>دوباره امتحان کن</Btn>
        </div>
      )}

      {status === "pending" && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}

      {status === "success" && viewMode === "cards" && <PortfolioCards portfolios={balance} />}

      {status === "success" && viewMode === "table" && <BalanceTable portfolios={balance} />}
    </TitledCard>
  )
}

interface CopyBtnProps {
  balance: MasterPortfolioWithId[]
}

function CopyBtn({ balance }: CopyBtnProps) {
  const selectedPortfolioId = useAtomValue(selectedPortfolioIdAtom)

  const handleCopyBtnClick = () => {
    const portfolioById = balance.find(p => p.id === selectedPortfolioId)
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

  return (
    <FloatingActionBtn
      icon={CopyIcon}
      title="کپی انتخاب شده"
      onClick={handleCopyBtnClick}
      disabled={typeof selectedPortfolioId !== "string"}
      fallback={
        <BtnTemplates.IconCopy
          onClick={handleCopyBtnClick}
          disabled={typeof selectedPortfolioId !== "string"}
          title="کپی انتخاب شده"
        />
      }
    />
  )
}
