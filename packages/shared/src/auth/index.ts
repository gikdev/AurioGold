import { storageManager } from "#shared/adapters"

export const getToken = () => storageManager.get("ttkk", "sessionStorage") || undefined

const getBearerAuth = () => ({
  Authorization: `Bearer ${getToken()}`,
})

export const getHeaderTokenOnly = () => ({
  headers: { ...getBearerAuth() },
})
