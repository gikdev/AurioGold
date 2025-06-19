import JalaliUtils from "@date-io/jalaali"
import { CopyIcon } from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { Btn, TextArea } from "@repo/shared/components"
import { formatPersianPrice, formatPersianString } from "@repo/shared/utils"
import type { RowSelectionOptions } from "ag-grid-community"
import type { ReactNode } from "react"

export const cellRenderers = {
  Rtl: ({ value }: { value: ReactNode }) => (
    <p dir="rtl" className="text-right">
      {value}
    </p>
  ),
  Ltr: ({ value }: { value: ReactNode }) => (
    <p dir="ltr" className="text-left">
      {value}
    </p>
  ),
  Monospaced: ({ value }: { value: ReactNode }) => (
    <p dir="ltr" className="text-left">
      <code>{value}</code>
    </p>
  ),
  Debt: ({ value }: { value: number }) => {
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
  PersianNum: ({ value }: { value: string | number }) => (
    <p dir="ltr" className="text-left">
      {formatPersianString(value)}
    </p>
  ),
  PersianComma: ({ value }: { value: string | number | null | undefined }) => (
    <span dir="ltr" className="text-left">
      {typeof value === "number" ? formatPersianPrice(value) : "-"}
    </span>
  ),
  TrueFalse: ({ value }: { value: boolean }) => (
    <p dir="auto" className="text-center">
      {value ? "✅" : "❌"}
    </p>
  ),
  DateAndTime: ({ value }: { value: Date | string }) => {
    const date = new Date(value)
    const persianDate = isoToPersianObject(typeof value === "string" ? value : value.toISOString())

    const formatDigit = (digit: number) => formatPersianString(digit.toString().padStart(2, "0"))

    return (
      <span dir="auto">
        <span>
          <span>{formatDigit(persianDate.year)}</span>
          <span>٫</span>
          <span>{formatDigit(persianDate.monthCode)}</span>
          <span>٫</span>
          <span>{formatDigit(persianDate.day)}</span>
        </span>
        <span> - </span>
        <span>
          <span>{formatDigit(date.getHours())}</span>
          <span>:</span>
          <span>{formatDigit(date.getMinutes())}</span>
          <span>:</span>
          <span>{formatDigit(date.getSeconds())}</span>
        </span>
      </span>
    )
  },
  TimeOnly: ({ value }: { value: Date | string }) => {
    const d = new Date(value)

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
  DateOnly: ({ value }: { value: Date | string }) => {
    const d = isoToPersianObject(typeof value === "string" ? value : value.toISOString())

    const formatDigit = (digit: number) => formatPersianString(digit.toString().padStart(2, "0"))

    return (
      <p dir="auto" className="text-center">
        {formatDigit(d.year)}٫{formatDigit(d.monthCode)}٫{formatDigit(d.day)}
      </p>
    )
  },
  Center: ({ value }: { value: ReactNode }) => (
    <p dir="auto" className="text-center">
      {value}
    </p>
  ),
  AutoLink: ({ value }: { value: string }) => (
    <a href={value} dir="ltr" className="text-left text-blue-9 underline block">
      {value}
    </a>
  ),
  LongText: ({ value }: { value: string }) => (
    <TextArea className="text-xs min-h-32" value={value} readOnly />
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
