import genDatApiConfig from "./datapi-config"

export const getBearer = () => ({
  Authorization: `Bearer ${genDatApiConfig().token}`,
})

export const getHeaderTokenOnly = () => ({
  headers: { ...getBearer() },
})
