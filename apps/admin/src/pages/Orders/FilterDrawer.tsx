import { FunnelIcon, TrashIcon } from "@phosphor-icons/react"
import { DrawerSheet } from "@repo/shared/components"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { Calendar } from "react-multi-date-picker"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/colors/green.css"
import { skins } from "@repo/shared/forms"
import { useDateFilterStore } from "./shared"

export const FilterDrawer = () => (
  <DrawerSheet open title="فیلتر" icon={FunnelIcon} btns={<DeleteBtn />} onClose={handleClose}>
    <div className="min-h-full flex flex-col py-4 gap-5">
      <FromDatePicker />
      <ToDatePicker />
    </div>
  </DrawerSheet>
)

const DeleteBtn = () => (
  <button type="button" className={skins.btn({ intent: "error" })} onClick={handleDelete}>
    <TrashIcon />
    <span>حذف</span>
  </button>
)

function handleDelete() {
  useDateFilterStore.getState().resetDate()
  handleClose()
}

function handleClose() {
  useDateFilterStore.getState().setOpen(false)
}

function FromDatePicker() {
  const fromDate = useDateFilterStore(s => s.fromDate)

  return (
    <div className={skins.labelerContainer()}>
      <p>از:</p>

      <Calendar
        className="bg-dark border-none"
        shadow={false}
        calendar={persian}
        locale={persian_fa}
        value={fromDate}
        onChange={v => useDateFilterStore.getState().setFromDate(v?.toDate() ?? new Date())}
      />
    </div>
  )
}

function ToDatePicker() {
  const toDate = useDateFilterStore(s => s.toDate)

  return (
    <div className={skins.labelerContainer()}>
      <p>تا:</p>

      <Calendar
        className="green bg-dark"
        shadow={false}
        calendar={persian}
        locale={persian_fa}
        value={toDate}
        onChange={v => useDateFilterStore.getState().setToDate(v?.toDate() ?? new Date())}
      />
    </div>
  )
}
