import { ArrowClockwiseIcon, FunnelIcon } from "@phosphor-icons/react"
import type { PropsWithChildren, ReactNode } from "react"
import { skins } from "#/shared/forms/skins"
import { useDateFilterStore } from "./shared"

interface FilterDrawerTableWrapperProps {
  title: string
  children: ReactNode
  onReloadBtnClick: () => void
}

export const FilterDrawerTableWrapper = ({
  children,
  title,
  onReloadBtnClick,
}: FilterDrawerTableWrapperProps) => (
  <div className="h-160 flex flex-col">
    <ItemsBar>
      <Title>{title}</Title>

      <ReloadBtn onClick={onReloadBtnClick} />
      <OpenFilterDrawerBtn />
    </ItemsBar>

    {children}
  </div>
)

const ItemsBar = ({ children }: PropsWithChildren) => (
  <div className="flex items-center gap-1">{children}</div>
)

const Title = ({ children }: PropsWithChildren) => (
  <h2
    className="
      text-slate-12 font-bold bg-slate-2
      pt-1 px-2 rounded-t-sm pb-2 relative
      top-2 border border-slate-6 me-auto
    "
  >
    {children}
  </h2>
)

const ReloadBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={skins.btn({ isIcon: true, className: "relative pb-4 top-2" })}
  >
    <ArrowClockwiseIcon size={24} />
  </button>
)

const openFilterDrawer = () => useDateFilterStore.getState().setOpen(true)

const OpenFilterDrawerBtn = () => (
  <button
    type="button"
    onClick={openFilterDrawer}
    className={skins.btn({ isIcon: true, className: "relative pb-4 top-2" })}
  >
    <FunnelIcon size={24} />
  </button>
)
