import JalaliUtils from "@date-io/jalaali"
import { CopyIcon } from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { Btn } from "@repo/shared/components"
import { formatPersianPrice, formatPersianString } from "@repo/shared/utils"
import type { RowSelectionOptions } from "ag-grid-community"
import type { CustomCellRendererProps } from "ag-grid-react"

export const cellRenderers = {
  Rtl: (p: CustomCellRendererProps) => (
    <p dir="rtl" className="text-right">
      {p.value}
    </p>
  ),
  Ltr: (p: CustomCellRendererProps) => (
    <p dir="ltr" className="text-left">
      {p.value}
    </p>
  ),
  Monospaced: (p: CustomCellRendererProps) => (
    <p dir="ltr" className="text-left">
      <code>{p.value}</code>
    </p>
  ),
  Debt: (p: CustomCellRendererProps) => {
    const value: number = p.value

    function handleCopyBtnClick() {
      navigator.clipboard
        .writeText(Math.abs(Number(value.toFixed(3))).toString())
        .then(() => notifManager.notify("کپی شد!", "toast", { status: "success" }))
        .catch(() =>
          notifManager.notify("یه اروری موقع کپی کردن پیش آمد...", "toast", { status: "error" }),
        )
    }

    const finalNumber = Math.abs(Number(value))

    return (
      <span className="flex gap-1 items-center" dir="ltr">
        <span dir="ltr" className={value >= 0 ? "text-green-10" : "text-red-10"}>
          {formatPersianPrice(finalNumber.toLocaleString())}
        </span>

        {value < 0 ? "(بدهکار)" : "(بستانکار)"}

        <Btn onClick={handleCopyBtnClick} className="w-8 min-h-8 p-1">
          <CopyIcon size={20} />
        </Btn>
      </span>
    )
  },
  PersianNum: (p: CustomCellRendererProps) => (
    <p dir="ltr" className="text-left">
      {formatPersianString(p.value)}
    </p>
  ),
  PersianComma: (p: CustomCellRendererProps) => (
    <p dir="ltr" className="text-left">
      {formatPersianPrice(p.value)}
    </p>
  ),
  TrueFalse: (p: CustomCellRendererProps) => (
    <p dir="auto" className="text-center">
      {p.value ? "✅" : "❌"}
    </p>
  ),
  TimeOnly: (p: CustomCellRendererProps) => {
    const d = new Date(p.value)

    const formatDigit = (digit: number) => formatPersianPrice(digit.toString().padStart(2, "0"))

    return (
      <p dir="auto" className="text-center">
        <span>{formatDigit(d.getHours())}</span>
        <span>:</span>
        <span>{formatDigit(d.getMinutes())}</span>
        <span>:</span>
        <span>{formatDigit(d.getSeconds())}</span>
      </p>
    )
  },
  DateOnly: (p: CustomCellRendererProps) => {
    const d = isoToPersianObject(p.value)

    const formatDigit = (digit: number) => formatPersianString(digit.toString().padStart(2, "0"))

    return (
      <p dir="auto" className="text-center">
        {formatDigit(d.year)}٫{formatDigit(d.monthCode)}٫{formatDigit(d.day)}
      </p>
    )
  },
  Center: (p: CustomCellRendererProps) => (
    <p dir="auto" className="text-center">
      {p.value}
    </p>
  ),
  AutoLink: (p: CustomCellRendererProps) => (
    <a href={p.value} dir="ltr" className="text-left text-blue-9 underline block">
      {p.value}
    </a>
  ),
}

export const multiRowSelectionOptions: RowSelectionOptions = {
  mode: "multiRow",
  enableClickSelection: true,
  enableSelectionWithoutKeys: true,
}

interface PersianDateObject {
  /** Day (1-31) */
  day: number

  /** Month code (1-12) */
  monthCode: number

  /** Month name (بهمن، اسفند...) */
  monthName: string

  /** Full year number */
  year: number
}

const jalaliUtils = new JalaliUtils()

function isoToPersianObject(isoString: string): PersianDateObject {
  const date = new Date(isoString)
  const jalaliDate = jalaliUtils.date(date)

  return {
    day: jalaliUtils.getDate(jalaliDate),
    monthCode: jalaliUtils.getMonth(jalaliDate) + 1,
    monthName: jalaliUtils.format(jalaliDate, "month"),
    year: jalaliUtils.getYear(jalaliDate),
  }
}
