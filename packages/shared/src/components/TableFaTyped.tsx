import {
  type ColDef,
  type ColGroupDef,
  colorSchemeDarkWarm,
  colorSchemeLightWarm,
  themeQuartz,
} from "ag-grid-community"
import { AgGridReact, type AgGridReactProps } from "ag-grid-react"
import { useAtomValue } from "jotai"
import { forwardRef, type Ref, useMemo } from "react"
import { currentThemeAtom } from "#shared/atoms"
import { AG_GRID_LOCALE_IR } from "../constants"

const selectedThemeDark = themeQuartz.withPart(colorSchemeDarkWarm)
const selectedThemeLight = themeQuartz.withPart(colorSchemeLightWarm)

type TableFaProps<T> = Omit<AgGridReactProps<T>, "columnDefs" | "rowData"> & {
  columnDefs?: (ColDef<T> | ColGroupDef<T>)[]
  rowData?: T[]
  className?: string
}

function _TableFaInner<T>(
  { className, columnDefs = [], rowData = [], ...other }: TableFaProps<T>,
  ref: React.Ref<AgGridReact<T>>,
) {
  const currentTheme = useAtomValue(currentThemeAtom)

  const selectedTheme = currentTheme === "dark" ? selectedThemeDark : selectedThemeLight

  const defaultColDef: ColDef<T> = useMemo(
    () => ({
      minWidth: 150,
      flex: 1,
      filter: true,
      floatingFilter: true,
      lockPosition: true,
    }),
    [],
  )

  return (
    <AgGridReact<T>
      ref={ref as Ref<AgGridReact<T>> | undefined}
      theme={selectedTheme}
      pagination
      paginationPageSize={50}
      enableRtl
      localeText={AG_GRID_LOCALE_IR}
      defaultColDef={{ ...defaultColDef, ...other.defaultColDef }}
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
