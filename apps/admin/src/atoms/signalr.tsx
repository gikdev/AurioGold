import * as signalR from "@microsoft/signalr"
import { currentProfile } from "@repo/profile-manager"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { useEffectButNotOnMount } from "@repo/shared/hooks"
import { atom, useAtom } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import routes from "#/pages/routes"
import { isAdminOnlineAtom } from "./adminConnectivity"

const AdminStatus = {
  Offline: 1,
  Online: 2,
  DISABLED: 3,
}

// Usage example is at the end of the file

function getBaseUrl() {
  return currentProfile.apiBaseUrl
}

function isLoggedInOrHasToken() {
  return !!storageManager.get("ttkk", "sessionStorage")
}

export function logOut() {
  storageManager.remove("ttkk", "sessionStorage")
  location.href = routes.login
}

export type ConnectionState = "unknown" | "disconnected" | "connected" | "loading"

export const connectionStateAtom = atom<ConnectionState>("unknown")
export const connectionRefAtom = atom<signalR.HubConnection | null>(null)

export function SignalRManager() {
  const initializationCountRef = useRef(0)
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom)
  const [connectionRef, setConnectionRef] = useAtom(connectionRefAtom)
  const [isAdminOnline, setAdminOnline] = useAtom(isAdminOnlineAtom)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const stopConnection = useCallback(async () => {
    try {
      await connectionRef?.stop()
    } catch (err) {
      notifManager.notify("Failed to stop the connection...", "console")
    }
  }, [])

  const startConnection = useCallback(async () => {
    const isDev = import.meta.env.DEV

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(isDev ? signalR.LogLevel.Information : signalR.LogLevel.Error)
      .withUrl(`${getBaseUrl()}/priceHub`)
      .build()

    connection.on("UserNotFound", () => {
      notifManager.notify("کاربر پیدا نشد. لطفا دوباره وارد شوید", "toast", { status: "warning" })
      if (isLoggedInOrHasToken()) setTimeout(() => logOut(), 2000)
    })

    connection.onreconnected(() => setConnectionState("connected"))
    connection.onclose(() => setConnectionState("disconnected"))

    try {
      setConnectionState("loading")
      await connection.start()
      setConnectionState("connected")
      const token = storageManager.get("ttkk", "sessionStorage")
      // In dev mode, StrictMode, makes it so this runs twice...
      // I had to stop it from doing it...
      if (token) {
        if (initializationCountRef.current > 0) return
        initializationCountRef.current++
        await connection.invoke("InitializeConnection", token)
      }
    } catch (err) {
      setConnectionState("disconnected")
    }

    setConnectionRef(connection)
  }, [setConnectionRef, setConnectionState])

  useEffect(() => {
    startConnection()
    return () => void stopConnection()
  }, [startConnection, stopConnection])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const isOnline =
      storageManager.get("status", "sessionStorage")?.toString() === AdminStatus.Online.toString()

    setAdminOnline(isOnline)
  }, [])

  useEffectButNotOnMount(() => {
    const val = isAdminOnline ? AdminStatus.Online : AdminStatus.Offline
    storageManager.save("status", val.toString(), "sessionStorage")
  }, [isAdminOnline])

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
