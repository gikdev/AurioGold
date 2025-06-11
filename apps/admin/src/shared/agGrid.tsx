import { CopyIcon } from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { Btn } from "@repo/shared/components"
import { formatPersianNumber } from "@repo/shared/utils"
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
          {formatPersianNumber(finalNumber.toLocaleString())}
        </span>

        {value < 0 ? "(بدهکار)" : "(بستانکار)"}

        <Btn onClick={handleCopyBtnClick} className="w-8 h-8 p-1">
          <CopyIcon size={20} />
        </Btn>
      </span>
    )
  },
  Price: (p: CustomCellRendererProps) => (
    <p dir="ltr" className="text-left">
      {formatPersianNumber(p.value)}
    </p>
  ),
  TrueFalse: (p: CustomCellRendererProps) => (
    <p dir="auto" className="text-center">
      {p.value ? "✅" : "❌"}
    </p>
  ),
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
