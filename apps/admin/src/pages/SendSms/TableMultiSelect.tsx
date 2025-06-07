import { TableFa } from "@repo/shared/components"
import type { ComponentProps } from "react"

type TableMultiSelectProps = ComponentProps<typeof TableFa> & {}

const rowSelection: TableMultiSelectProps["rowSelection"] = {
  mode: "multiRow",
  enableClickSelection: true,
  enableSelectionWithoutKeys: true,
}

export function TableMultiSelect({ ...other }: TableMultiSelectProps) {
  return <TableFa rowSelection={rowSelection} {...other} />
}
