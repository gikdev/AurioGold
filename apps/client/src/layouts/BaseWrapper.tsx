import { DatapiConfigProvider, apiRequest } from "@gikdev/react-datapi/src"
import {
  CoinsIcon,
  GearIcon,
  InfoIcon,
  ReceiptIcon,
  ScalesIcon,
  StorefrontIcon,
  UserCircleIcon,
} from "@phosphor-icons/react"
import { ErrorCardBoundary } from "@repo/shared/components"
import { Base, type SidebarItem } from "@repo/shared/layouts"
import { useEffect, useMemo } from "react"
import { Outlet } from "react-router"
import { SignalRManager } from "#/atoms/signalr"
import StatusBar from "#/layouts/StatusBar"
import routes from "#/pages/routes"
import genDatApiConfig from "#/shared/datapi-config"
import { Nav } from "./Nav"

const SIDEBAR_ITEMS: SidebarItem[] = [
  // { id: 92837, text: "خانه", icon: HouseLineIcon, url: routes.home },
  { id: 92834, text: "معاملات", icon: StorefrontIcon, url: routes.base },
  { id: 90847, text: "پروفایل", icon: UserCircleIcon, url: routes.profile },
  { id: 12369, text: "مشاهده سفارشات", icon: ReceiptIcon, url: routes.orders },
  { id: 95487, text: "شرایط و قوانین", icon: ScalesIcon, url: routes.rules },
  { id: 29837, text: "درباره ما", icon: InfoIcon, url: routes.about },
  // { id: 10928, text: "ثبت سند", icon: PenNib, url: "/docs" },
  // { id: 83748, text: "ثبت حواله", icon: PenNib, url: "/transfers" },
  { id: 29374, text: "مانده حساب", icon: CoinsIcon, url: routes.balance },
  { id: 73649, text: "تنظیمات", icon: GearIcon, url: routes.settings },
]

export function BaseWrapper() {
  const config = useMemo(() => genDatApiConfig(), [])

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

  return null
}
