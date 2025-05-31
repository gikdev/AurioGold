import { DatapiConfigProvider, apiRequest } from "@gikdev/react-datapi/src"
import { CodeIcon, HouseLineIcon } from "@phosphor-icons/react"
import { ErrorCardBoundary } from "@repo/shared/components"
import { Base, type SidebarItem } from "@repo/shared/layouts"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { Outlet } from "react-router"
import { onlineUsersCountAtom } from "#/atoms"
import { connectionRefAtom, connectionStateAtom } from "#/atoms/signalr"
import { SignalRManager } from "#/atoms/signalr"
import OnlineUsersStatusBar from "#/layouts/OnlineUsersStatusBar"
import routes from "#/pages/routes"
import datApiConfig from "#/shared/datapi-config"
import { Nav } from "./Nav"

const getTime = () =>
  apiRequest({
    options: {
      url: "/TyStocks/GetTime",
      onError: msg => console.log(msg),
    },
  })

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 0, text: "خانه", icon: HouseLineIcon, url: routes.home },
  // { id: 1, text: "ERROR!", icon: UserCircleIcon, url: "/profile" },
  // { id: 2, text: "ارسال پیامک", icon: ChatTextIcon, url: "/send-sms" },
  // { id: 3, text: "مدیریت کاربران", icon: UserCircleGearIcon, url: "/customers" },
  // { id: 4, text: "مدیریت گروه مشتری گرمی", icon: UsersFourIcon, url: "/groups-gram" },
  // { id: 5, text: "مدیریت گروه مشتری عددی", icon: UsersFourIcon, url: "/groups-number" },
  // { id: 6, text: "کاربران آنلاین", icon: UsersFourIcon, url: "/online-users" },
  // { id: 7, text: "مدیریت منابع قیمت", icon: ArrowsCounterClockwiseIcon, url: "/price-sources" },
  // { id: 8, text: "مدیریت محصولات", icon: CubeIcon, url: "/products" },
  // { id: 9, text: "مدیریت سفارشات", icon: ReceiptIcon, url: "/orders" },
  // // { id: 10, text: "مدیریت حواله‌ها", icon: Scroll, url: "/transfers" },
  // // { id: 11, text: "مدیریت سندها", icon: Scroll, url: "/docs" },
  // { id: 12, text: "مانده حساب مشتری", icon: CoinsIcon, url: "/customer-remaining" },
  // { id: 13, text: "مانده حساب", icon: CoinsIcon, url: "/remaining" },
  // { id: 14, text: "ثبت اطلاعات فروشگاه", icon: StorefrontIcon, url: "/edit-home" },
  // { id: 15, text: "ثبت قوانین", icon: ScalesIcon, url: "/edit-rules" },
  // { id: 16, text: "ثبت درباره ما", icon: InfoIcon, url: "/edit-about" },
  // { id: 17, text: "تنظیمات", icon: GearIcon, url: "/settings" },
]

const isDev = import.meta.env.DEV
const devModeSidebarItem = { id: 999, text: "تست", icon: CodeIcon, url: "/test" }
if (isDev) SIDEBAR_ITEMS.push(devModeSidebarItem)

export function BaseWrapper() {
  const setOnlineUsersCount = useSetAtom(onlineUsersCountAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const connection = useAtomValue(connectionRefAtom)

  useEffect(() => void getTime(), [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (connectionState !== "connected" || !connection) return
    connection.on("OnlineCount", c => setOnlineUsersCount(c))
    return () => connection.off("OnlineCount")
  }, [connectionState])

  return (
    <ErrorCardBoundary>
      <DatapiConfigProvider config={datApiConfig}>
        <SignalRManager />
        <Base nav={<Nav />} sidebarItems={SIDEBAR_ITEMS}>
          <div className="grow shrink">
            <Outlet />
          </div>
          <OnlineUsersStatusBar />
        </Base>
      </DatapiConfigProvider>
    </ErrorCardBoundary>
  )
}
