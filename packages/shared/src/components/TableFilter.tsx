import { type ComponentProps, useEffect, useRef } from "react"
import DatePicker from "react-multi-date-picker"
import { styled } from "#/helpers"

const StyledDatePicker = styled(
  DatePicker,
  "w-full grow shrink text-center px-4 py-3",
  "bg-slate-3 border border-slate-6",
  "rounded text-slate-11 w-full focus:text-slate-12",
  "focus:border-transparent focus:bg-slate-5",
)

interface FilterProps {
  fromDate: Date
  toDate: Date
  setFromDate: (input: Date) => void
  setToDate: (input: Date) => void
  mutate: () => void
}

export function Filter({ fromDate, toDate, setFromDate, setToDate, mutate }: FilterProps) {
  const prevFrom = useRef<number>(fromDate.getTime())
  const prevTo = useRef<number>(toDate.getTime())

  useEffect(() => {
    const currentFrom = fromDate.getTime()
    const currentTo = toDate.getTime()

    const changed = currentFrom !== prevFrom.current || currentTo !== prevTo.current
    if (!changed) return

    prevFrom.current = currentFrom
    prevTo.current = currentTo

    mutate()
  }, [fromDate, toDate, mutate])

  return (
    <div className="flex items-center gap-2 flex-col sm:flex-row mb-3">
      <p className="w-max shrink-0">فیلتر بر اساس تاریخ از:</p>
      <StyledDatePicker value={fromDate} onChange={genDatePickerChangeHandler(setFromDate)} />
      <p className="w-max shrink-0">تا:</p>
      <StyledDatePicker value={toDate} onChange={genDatePickerChangeHandler(setToDate)} />
    </div>
  )
}

type DatePickerChangeHandler = ComponentProps<typeof StyledDatePicker>["onChange"]

function genDatePickerChangeHandler(setter: (input: Date) => void): DatePickerChangeHandler {
  return e => {
    if (e == null) {
      setter(new Date())
    } else if (Array.isArray(e)) {
      const flatted = e.flat()
      setter(flatted?.[0]?.toDate() ?? new Date())
    } else {
      setter(e?.toDate() ?? new Date())
    }
  }
}
