import { ArrowClockwiseIcon, FunnelIcon } from "@phosphor-icons/react"
import { skins } from "@repo/shared/forms"
import { refetchGetOrders, useDateFilterStore } from "../shared"

export const OtherControls = () => (
  <>
    <ReloadBtn onClick={refetchGetOrders} />
    <OpenFilterDrawerBtn />
  </>
)

const ReloadBtn = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className={skins.btn({ isIcon: true })}>
    <ArrowClockwiseIcon size={24} />
  </button>
)

const openFilterDrawer = () => useDateFilterStore.getState().setOpen(true)

const OpenFilterDrawerBtn = () => (
  <button type="button" onClick={openFilterDrawer} className={skins.btn({ isIcon: true })}>
    <FunnelIcon size={24} />
  </button>
)
