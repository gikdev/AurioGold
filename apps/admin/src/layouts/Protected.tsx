import { storageManager } from "@repo/shared/adapters"
import { Navigate, Outlet } from "react-router"
import routes from "#/pages/routes"

function useAuth() {
  const token = storageManager.get("ttkk", "sessionStorage")
  const isTokenValid = (() => !!token)()
  const isLoggedIn = (() => isTokenValid)()

  return isLoggedIn
}

export default function Protected() {
  const isLoggedIn = useAuth()

  return isLoggedIn ? <Outlet /> : <Navigate to={routes.login} replace />
}
