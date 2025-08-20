import genDatApiConfig from "../datapi-config"

const getBearer = () => ({
  Authorization: `Bearer ${genDatApiConfig().token}`,
})

export const getHeaderTokenOnly = () => ({
  headers: { ...getBearer() },
})

export * from "./components"
