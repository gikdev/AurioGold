import { colorSchemeDarkBlue, themeMaterial, themeQuartz } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { type ComponentProps, forwardRef } from "react"
import { AG_GRID_LOCALE_IR } from "../constants"

const selectedTheme = themeQuartz.withPart(colorSchemeDarkBlue)

type AgGridReactProps = ComponentProps<typeof AgGridReact>

const defaultColDef: AgGridReactProps["defaultColDef"] = {
  minWidth: 150,
  flex: 1,
  filter: true,
  floatingFilter: true,
  lockPosition: true,
}

export interface TableFaProps extends AgGridReactProps {}

export const TableFa = forwardRef<AgGridReact, TableFaProps>(({ className, ...other }, ref) => (
  <AgGridReact
    theme={selectedTheme}
    ref={ref}
    localeText={AG_GRID_LOCALE_IR}
    pagination
    paginationPageSize={50}
    enableRtl
    defaultColDef={defaultColDef}
    {...other}
  />
))
