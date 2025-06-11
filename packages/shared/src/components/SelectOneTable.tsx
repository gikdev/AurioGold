import type { ColDef, SelectionChangedEvent } from "ag-grid-community"
import type { AgGridReactProps } from "ag-grid-react"
import type { ComponentType } from "react"

interface SelectOneTableProps<T, K extends keyof T> extends AgGridReactProps<T> {
  Table: ComponentType<AgGridReactProps<T>>
  rowData: T[]
  columnDefs: ColDef<T>[]
  selectionKey?: K
  setSelection: (selectedKeyValue: T[K]) => void
}

export function SelectOneTable<
  T extends Record<string, unknown>,
  K extends keyof T & string = "id",
>({ Table, selectionKey = "id" as K, setSelection, ...other }: SelectOneTableProps<T, K>) {
  const handleSelectionChange = (e: SelectionChangedEvent) => {
    const selectedRows = e.api.getSelectedRows() as T[]
    if (selectedRows.length === 1 && selectionKey in selectedRows[0]) {
      setSelection(selectedRows[0][selectionKey] as T[K])
    }
  }

  return <Table onSelectionChanged={handleSelectionChange} {...other} />
}
