import * as signalR from "@microsoft/signalr"
import { notifManager } from "@repo/shared/adapters"
import { atom, useAtom, useSetAtom } from "jotai"
import Cookies from "js-cookie"
import { useEffect } from "react"

// Usage example is at the end of the file

const getBaseUrl = () => {
  throw new Error("getBaseUrl not implemented")
}
// Wasn't sure about the name & the implementation
const isLoggedInOrHasToken = () => {
  throw new Error("isLoggedIn not implemented")
}
const logOut = () => {
  throw new Error("logOut not implemented")
}

export type ConnectionState = "unknown" | "disconnected" | "connected" | "loading"

export const connectionStateAtom = atom<ConnectionState>("unknown")
export const connectionRefAtom = atom<signalR.HubConnection | null>(null)

export const startSignalRAtom = atom(null, async (_, set) => {
  const isDev = import.meta.env.DEV

  const connection = new signalR.HubConnectionBuilder()
    .configureLogging(isDev ? signalR.LogLevel.Information : signalR.LogLevel.Error)
    .withUrl(`${getBaseUrl()}/priceHub`)
    .build()

  connection.on("UserNotFound", () => {
    notifManager.notify("کاربر پیدا نشد. لطفا دوباره وارد شوید", "toast", { status: "warning" })
    if (isLoggedInOrHasToken()) setTimeout(() => logOut(), 2000)
  })

  connection.onreconnected(() => set(connectionStateAtom, "connected"))
  connection.onclose(() => set(connectionStateAtom, "disconnected"))

  try {
    set(connectionStateAtom, "loading")
    await connection.start()
    set(connectionStateAtom, "connected")
    const token = Cookies.get("ttkk")
    if (token) await connection.invoke("InitializeConnection", token)
  } catch (err) {
    set(connectionStateAtom, "disconnected")
  }

  set(connectionRefAtom, connection)
})

export const stopSignalRAtom = atom(null, async get => {
  const connection = get(connectionRefAtom)
  try {
    await connection?.stop()
  } catch (err) {
    notifManager.notify("Failed to stop the connection...", "console")
  }
})

export function SignalRManager() {
  const connectionState = useAtom(connectionStateAtom)[0]
  const startConnection = useSetAtom(startSignalRAtom)
  const stopConnection = useSetAtom(stopSignalRAtom)

  useEffect(() => {
    startConnection()
    return () => void stopConnection()
  }, [startConnection, stopConnection])

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
