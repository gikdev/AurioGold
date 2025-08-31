import { storageManager } from "#shared/adapters"

export const getToken = (app: "admin" | "client") =>
  storageManager.get(`${app}_ttkk`, "sessionStorage") || undefined

const getBearerAuth = (app: "admin" | "client") => ({
  Authorization: `Bearer ${getToken(app)}`,
})

export const getHeaderTokenOnly = (app: "admin" | "client") => ({
  headers: { ...getBearerAuth(app) },
})
