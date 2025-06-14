import { FunnelIcon } from "@phosphor-icons/react"
import { BtnTemplates, DrawerSheet, Labeler, useDrawerSheet } from "@repo/shared/components"
import { memo } from "react"
import { QUERY_KEYS } from "./navigation"
import type { DateFilterReturn } from "./useDateFilter"
import { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/colors/green.css"

interface FilterDrawerProps {
  dateFilterState: DateFilterReturn
}

function _FilterDrawer({ dateFilterState }: FilterDrawerProps) {
  const [showFilterDrawer, setShowFilterDrawer] = useDrawerSheet(QUERY_KEYS.filter)
  const { fromDate, setFromDate, toDate, setToDate } = dateFilterState

  const handleClose = () => setShowFilterDrawer(false)
  const handleDelete = () => {}

  const btns = (
    <>
      <BtnTemplates.Close onClick={handleClose} />
      <BtnTemplates.Delete onClick={handleDelete} />
    </>
  )

  return (
    <DrawerSheet
      onClose={handleClose}
      open={showFilterDrawer}
      title="فیلتر"
      icon={FunnelIcon}
      btns={btns}
    >
      <div className="min-h-full flex flex-col py-4 gap-5">
        <Labeler labelText="از:" as="div">
          <Calendar className="bg-dark border-none" shadow={false} calendar={persian} locale={persian_fa} value={fromDate} onChange={v => setFromDate(v?.toDate() ?? new Date())} />
        </Labeler>

        <Labeler labelText="تا:" as="div">
          <Calendar className="green bg-dark" shadow={false} calendar={persian} locale={persian_fa} value={toDate} onChange={v => setToDate(v?.toDate() ?? new Date())} />
        </Labeler>
      </div>
    </DrawerSheet>
  )
}

const FilterDrawer = memo(_FilterDrawer)
export default FilterDrawer
