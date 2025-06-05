import { TableFa } from "@repo/shared/components"
import type { ComponentProps } from "react"

type TableMutliSelectProps = ComponentProps<typeof TableFa> & {}

const rowSelection: TableMutliSelectProps["rowSelection"] = {
  mode: "multiRow",
  enableClickSelection: true,
  enableSelectionWithoutKeys: true,
}

export function TableMutliSelect({ ...other }: TableMutliSelectProps) {
  return <TableFa rowSelection={rowSelection} {...other} />
}
