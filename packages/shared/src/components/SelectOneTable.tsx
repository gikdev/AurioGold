import { useRef } from "react"
import { TableFa, type TableFaProps } from "#/components"

interface SelectOneTableProps<
  // ---
  T extends Record<string, unknown>,
  K extends keyof T & string = "id",
> extends TableFaProps {
  /** The key in the row data to extract when a row is selected Defaults to `"id"` */
  selectionKey?: K

  /** A callback that receives the value of `selectionKey` from the selected row.  */
  setSelection: (selectedKeyValue: T[K]) => void
}

/**
 * A wrapper around TableFa that allows selecting exactly one row.
 * When a single row is selected, it calls `setSelection` with the value at `selectionKey`.
 *
 * @typeParam T - The shape of each row in the table.
 * @typeParam K - The key of `T` to extract when a row is selected.
 *
 * @example
 * ```tsx
 * type User = {
 *   id: number
 *   name: string
 *   email: string
 * }
 *
 * function UserTable() {
 *   const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
 *
 *   return (
 *     <SelectOneTable<User>
 *       rowData={[{ id: 1, name: "Ali", email: "ali@example.com" }]}
 *       selectionKey="id"
 *       setSelection={(id) => setSelectedUserId(id)}
 *       columnDefs={[{ field: "name" }, { field: "email" }]}
 *     />
 *   )
 * }
 * ```
 */
export function SelectOneTable<
  T extends Record<string, unknown>,
  K extends keyof T & string = "id",
>({ setSelection, selectionKey = "id" as K, ...other }: SelectOneTableProps<T, K>) {
  const tableRef = useRef(null)

  const handleSelectionChange: TableFaProps["onSelectionChanged"] = e => {
    const selectedRows = e.api.getSelectedRows() as T[]
    if (selectedRows.length !== 1) return

    const obj = selectedRows[0]

    if (obj && selectionKey && selectionKey in obj) {
      setSelection(obj[selectionKey] as T[K])
    }
  }

  return <TableFa ref={tableRef} onSelectionChanged={handleSelectionChange} {...other} />
}
