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
