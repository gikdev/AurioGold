import { type ColDef, type ColGroupDef, colorSchemeDarkBlue, themeQuartz } from "ag-grid-community"
import { AgGridReact, type AgGridReactProps } from "ag-grid-react"
import { forwardRef } from "react"
import { AG_GRID_LOCALE_IR } from "../constants"

const selectedTheme = themeQuartz.withPart(colorSchemeDarkBlue)

const defaultColDef: ColDef = {
  minWidth: 150,
  flex: 1,
  filter: true,
  floatingFilter: true,
  lockPosition: true,
}

type TableFaProps<T> = Omit<AgGridReactProps<T>, "columnDefs" | "rowData"> & {
  columnDefs?: (ColDef<T> | ColGroupDef<T>)[]
  rowData?: T[]
  className?: string
}

function _TableFaInner<T>(
  { className, columnDefs = [], rowData = [], ...other }: TableFaProps<T>,
  ref: React.Ref<AgGridReact<T>>,
) {
  return (
    <AgGridReact<T>
      ref={ref}
      theme={selectedTheme}
      pagination
      paginationPageSize={50}
      enableRtl
      localeText={AG_GRID_LOCALE_IR}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
      rowData={rowData}
      {...other}
    />
  )
}

const _TableFa = forwardRef(_TableFaInner) as <T>(
  props: TableFaProps<T> & { ref?: React.Ref<AgGridReact<T>> },
) => React.ReactElement

export function createTypedTableFa<T>() {
  return _TableFa as React.ForwardRefExoticComponent<
    TableFaProps<T> & React.RefAttributes<AgGridReact<T>>
  >
}
