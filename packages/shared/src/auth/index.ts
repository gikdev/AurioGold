import { client } from "@repo/api-client"
import { useEffect } from "react"
import { storageManager } from "#shared/adapters"

export const getToken = (app: "admin" | "client") =>
  storageManager.get(`${app}_ttkk`, "sessionStorage") || undefined

export function getSomeAuthToken() {
  const adminToken = sessionStorage.getItem("admin_ttkk")
  if (adminToken) return adminToken

  const clientToken = sessionStorage.getItem("client_ttkk")
  if (clientToken) return clientToken

  const token = sessionStorage.getItem("ttkk")
  if (token) return token

  return undefined
}

export function useAddLogOutOn401InterceptorToFetchClient() {
  useEffect(() => {
    const interceptorId = client.interceptors.response.use(kickUserOutOn401Interceptor)
    return () => client.interceptors.response.eject(interceptorId)
  }, [])
}

async function kickUserOutOn401Interceptor(res: Response) {
  if (res.status === 401) logout()
  return res
}

function logout() {
  storageManager.remove("admin_ttkk", "sessionStorage")
  storageManager.remove("client_ttkk", "sessionStorage")
  storageManager.remove("ttkk", "sessionStorage")

  setTimeout(() => {
    location.href = "/login"
  }, 3000)
}

export function useAddAuthInterceptorToFetchClient() {
  useEffect(() => {
    const interceptorId = client.interceptors.request.use(addTokenToRequestInterceptor)
    return () => client.interceptors.request.eject(interceptorId)
  }, [])
}

function addTokenToRequestInterceptor(req: Request) {
  req.headers.set("Authorization", `Bearer ${getSomeAuthToken()}`)
  return req
}
