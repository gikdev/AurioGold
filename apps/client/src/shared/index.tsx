import { QueryClient } from "@tanstack/react-query"
import genDatApiConfig from "./datapi-config"

export const queryClient = new QueryClient()

const getBearer = () => ({
  Authorization: `Bearer ${genDatApiConfig().token}`,
})

export const getHeaderTokenOnly = () => ({
  headers: { ...getBearer() },
})
