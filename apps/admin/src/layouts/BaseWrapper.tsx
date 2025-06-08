import { DatapiConfigProvider, apiRequest } from "@gikdev/react-datapi/src"
import {
  ChatTextIcon,
  HouseLineIcon,
  UserCircleGearIcon,
  UserCircleIcon,
} from "@phosphor-icons/react"
import { ErrorCardBoundary } from "@repo/shared/components"
import { Base, type SidebarItem } from "@repo/shared/layouts"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { Outlet } from "react-router"
import { onlineUsersCountAtom } from "#/atoms"
import { connectionRefAtom, connectionStateAtom } from "#/atoms/signalr"
import { SignalRManager } from "#/atoms/signalr"
import StatusBar from "#/layouts/StatusBar"
import routes from "#/pages/routes"
import genDatApiConfig from "#/shared/datapi-config"
import { Nav } from "./Nav"

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 0, text: "خانه", icon: HouseLineIcon, url: routes.home },
  { id: 1, text: "پروفایل", icon: UserCircleIcon, url: routes.profile },
  { id: 2, text: "ارسال پیامک", icon: ChatTextIcon, url: routes.sendSms },
  { id: 3, text: "مدیریت کاربران", icon: UserCircleGearIcon, url: routes.customers },
  // { id: 4, text: "مدیریت گروه مشتری گرمی", icon: UsersFourIcon, url: "/groups-gram" },
  // { id: 5, text: "مدیریت گروه مشتری عددی", icon: UsersFourIcon, url: "/groups-number" },
  // { id: 6, text: "کاربران آنلاین", icon: UsersFourIcon, url: "/online-users" },
  // { id: 7, text: "مدیریت منابع قیمت", icon: ArrowsCounterClockwiseIcon, url: "/price-sources" },
  // { id: 8, text: "مدیریت محصولات", icon: CubeIcon, url: "/products" },
  // { id: 9, text: "مدیریت سفارشات", icon: ReceiptIcon, url: "/orders" },
  // { id: 10, text: "مدیریت حواله‌ها", icon: ScrollIcon, url: "/transfers" },
  // { id: 11, text: "مدیریت سندها", icon: ScrollIcon, url: "/docs" },
  // { id: 12, text: "مانده حساب مشتری", icon: CoinsIcon, url: "/customer-remaining" },
  // { id: 13, text: "مانده حساب", icon: CoinsIcon, url: "/remaining" },
  // { id: 14, text: "ثبت اطلاعات فروشگاه", icon: StorefrontIcon, url: "/edit-home" },
  // { id: 15, text: "ثبت قوانین", icon: ScalesIcon, url: "/edit-rules" },
  // { id: 16, text: "ثبت درباره ما", icon: InfoIcon, url: "/edit-about" },
  // { id: 17, text: "تنظیمات", icon: GearIcon, url: "/settings" },
]

// Memoized config (only created once)
const config = genDatApiConfig()

export function BaseWrapper() {
  return (
    <ErrorCardBoundary>
      <DatapiConfigProvider config={config}>
        <ConnectionHandler />
        <SignalRManager />
        <Base nav={<Nav />} footer={<StatusBar />} sidebarItems={SIDEBAR_ITEMS}>
          <Outlet />
        </Base>
      </DatapiConfigProvider>
    </ErrorCardBoundary>
  )
}

function ConnectionHandler() {
  const setOnlineUsersCount = useSetAtom(onlineUsersCountAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const connection = useAtomValue(connectionRefAtom)

  // Time fetch with proper cleanup
  useEffect(() => {
    const controller = new AbortController()

    apiRequest({
      options: {
        url: "/TyStocks/GetTime",
        onError: console.error,
      },
      signal: controller.signal,
      config,
    })

    return () => controller.abort()
  }, [])

  // Connection handler with proper dependencies
  useEffect(() => {
    if (connectionState !== "connected" || !connection) return

    const handler = (count: number) => {
      setOnlineUsersCount(count)
    }

    connection.on("OnlineCount", handler)

    return () => {
      connection.off("OnlineCount", handler)
    }
  }, [connectionState, connection, setOnlineUsersCount])

  return null
}
