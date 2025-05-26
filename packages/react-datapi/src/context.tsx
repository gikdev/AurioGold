import React from "react"
import { createContext, type ReactNode, useContext } from "react"
import type { GlobalConfigOptions } from "./types"

const DatapiConfigContext = createContext<GlobalConfigOptions>({} as GlobalConfigOptions)

interface DatapiConfigProviderProps {
  config: GlobalConfigOptions
  children: ReactNode
}

export function DatapiConfigProvider({ children, config }: DatapiConfigProviderProps) {
  return <DatapiConfigContext.Provider value={config}>{children}</DatapiConfigContext.Provider>
}

export const useDatapiConfigContext = () => useContext(DatapiConfigContext)
