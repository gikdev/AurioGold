import { apiRequest, DatapiConfigProvider } from "@gikdev/react-datapi/src"
import {
  ChatTextIcon,
  CoinsIcon,
  CubeIcon,
  GearIcon,
  HouseLineIcon,
  ReceiptIcon,
  TagIcon,
  UserCircleGearIcon,
  UserCircleIcon,
  UsersFourIcon,
} from "@phosphor-icons/react"
import { ErrorCardBoundary } from "@repo/shared/components"
import { Base, type SidebarItem } from "@repo/shared/layouts"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useMemo } from "react"
import { Outlet } from "react-router"
import { onlineUsersCountAtom } from "#/atoms"
import { connectionRefAtom, connectionStateAtom, SignalRManager } from "#/atoms/signalr"
import StatusBar from "#/layouts/StatusBar"
import routes from "#/pages/routes"
import genDatApiConfig from "#/shared/datapi-config"
import { Nav } from "./Nav"
import { useNotifyOrders } from "./useNotifyOrders"

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 0, text: "خانه", icon: HouseLineIcon, url: routes.home },
  { id: 1, text: "پروفایل", icon: UserCircleIcon, url: routes.profile },
  { id: 2, text: "ارسال پیامک", icon: ChatTextIcon, url: routes.sendSms },
  { id: 3, text: "مدیریت مشتریان", icon: UserCircleGearIcon, url: routes.customers },
  { id: 4, text: "مدیریت گروه گرمی", icon: UsersFourIcon, url: routes.groupsGram },
  { id: 5, text: "مدیریت گروه عددی", icon: UsersFourIcon, url: routes.groupsNumeric },
  { id: 6, text: "کاربران آنلاین", icon: UsersFourIcon, url: routes.onlineUsers },
  { id: 7, text: "مدیریت منابع قیمت", icon: TagIcon, url: routes.priceSources },
  { id: 8, text: "مدیریت محصولات", icon: CubeIcon, url: routes.products },
  { id: 9, text: "مدیریت سفارشات", icon: ReceiptIcon, url: routes.orders },
  // { id: 10, text: "مدیریت حواله‌ها", icon: ScrollIcon, url: "/transfers" },
  // { id: 11, text: "مدیریت سندها", icon: ScrollIcon, url: "/docs" },
  { id: 13, text: "مانده حساب", icon: CoinsIcon, url: "/balance" },
  { id: 14, text: "تنظیمات", icon: GearIcon, url: routes.settings },
]

export function BaseWrapper() {
  const config = useMemo(() => genDatApiConfig(), [])
  useNotifyOrders()

  return (
    <ErrorCardBoundary>
      <DatapiConfigProvider config={config}>
        <ConnectionHandler />
        <SignalRManager />
        <Base app="admin" nav={<Nav />} footer={<StatusBar />} sidebarItems={SIDEBAR_ITEMS}>
          <Outlet />
        </Base>
      </DatapiConfigProvider>
    </ErrorCardBoundary>
  )
}

function ConnectionHandler() {
  const setCount = useSetAtom(onlineUsersCountAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const connection = useAtomValue(connectionRefAtom)

  // Time fetch with proper cleanup
  useEffect(() => {
    apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/TyStocks/GetTime",
        onError: console.error,
      },
    })
  }, [])

  // Connection handler with proper dependencies
  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (connectionState !== "connected" || !connection) return

    const handleOnlineCount = (count: number) => setCount(count)

    connection.on("OnlineCount", handleOnlineCount)

    return () => connection.off("OnlineCount", handleOnlineCount)
  }, [connectionState, connection])

  return null
}
