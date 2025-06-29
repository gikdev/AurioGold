import * as signalR from "@microsoft/signalr"
import { currentProfile } from "@repo/profile-manager"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { atom, useAtom, useSetAtom } from "jotai"
import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router"
import routes from "#/pages/routes"
import { isAdminOnlineAtom } from "."

// Usage example is at the end of the file

function getBaseUrl() {
  return currentProfile.apiBaseUrl
}

function isLoggedInOrHasToken() {
  return !!storageManager.get("ttkk", "sessionStorage")
}

export function logout() {
  storageManager.remove("ttkk", "sessionStorage")
  setTimeout(() => {
    location.href = routes.login
  }, 3000)
}

export type ConnectionState = "unknown" | "disconnected" | "connected" | "loading"

export const connectionStateAtom = atom<ConnectionState>("unknown")
export const connectionRefAtom = atom<signalR.HubConnection | null>(null)

export function SignalRManager() {
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom)
  const [connectionRef, setConnectionRef] = useAtom(connectionRefAtom)
  const setAdminOnline = useSetAtom(isAdminOnlineAtom)
  const navigate = useNavigate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const stopConnection = useCallback(async () => {
    try {
      await connectionRef?.stop()
    } catch (err) {
      notifManager.notify("Failed to stop the connection...", "console")
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const startConnection = useCallback(async () => {
    const isDev = import.meta.env.DEV

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(isDev ? signalR.LogLevel.Information : signalR.LogLevel.Error)
      .withUrl(`${getBaseUrl()}/priceHub`)
      .build()

    connection.on("UserNotFound", () => {
      notifManager.notify("کاربر پیدا نشد. لطفا دوباره وارد شوید", "toast", { status: "warning" })
      if (isLoggedInOrHasToken()) setTimeout(() => navigate(routes.logout), 2000)
    })

    connection.onreconnected(() => setConnectionState("connected"))
    connection.onclose(() => setConnectionState("disconnected"))

    try {
      setConnectionState("loading")
      await connection.start()
      setConnectionState("connected")
      const token = storageManager.get("ttkk", "sessionStorage")
      await connection.invoke("InitializeConnection", token)
    } catch (err) {
      setConnectionState("disconnected")
    }

    setConnectionRef(connection)
  }, [])

  useEffect(() => {
    startConnection()
    return () => void stopConnection()
  }, [startConnection, stopConnection])

  // Handle UI update when admin connectivity status changed on another instance of the app
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!connectionRef) return

    connectionRef.on("MasterStatusChange", (incomingMasterId, _isOnline) => {
      const masterId = storageManager.get("masterID", "sessionStorage")
      if (Number(masterId) !== Number(incomingMasterId)) return
      setAdminOnline(_isOnline)
    })

    return () => connectionRef.off("MasterStatusChange")
  }, [connectionRef, connectionState])

  // Connect again if disconnected
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionState === "disconnected") startConnection()
    }, 5000)

    return () => clearInterval(interval)
  }, [connectionState, startConnection])

  return null
}

/*
Usage Example:

1. In your App.tsx or RootLayout.tsx:

import { SignalRManager } from "@/atoms/signalr"

function App() {
  return (
    <>
      <SignalRManager />
      <YourAppRoutes />
    </>
  )
}

2. Anywhere in your app where you need access to the connection:

import { useAtom } from "jotai"
import { connectionRefAtom, connectionStateAtom } from "@/atoms/signalr"

function SomeComponent() {
  const [connectionState] = useAtom(connectionStateAtom)
  const [connection] = useAtom(connectionRefAtom)

  const sendMessage = () => {
    if (connection) {
      connection.invoke("SendSomething", "hello world")
    }
  }

  return (
    <div>
      <p>State: {connectionState}</p>
      <button onClick={sendMessage}>Send Hello</button>
    </div>
  )
}
*/
