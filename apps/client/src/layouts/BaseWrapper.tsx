import { apiRequest, DatapiConfigProvider } from "@gikdev/react-datapi/src"
import {
  CoinsIcon,
  GearIcon,
  InfoIcon,
  ReceiptIcon,
  ScalesIcon,
  StorefrontIcon,
  UserCircleIcon,
} from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { ErrorCardBoundary } from "@repo/shared/components"
import { parseError } from "@repo/shared/helpers"
import { Base, type SidebarItem } from "@repo/shared/layouts"
import { useEffect } from "react"
import { Outlet } from "react-router"
import { SignalRManager } from "#/atoms/signalr"
import StatusBar from "#/layouts/StatusBar"
import routes from "#/pages/routes"
import genDatApiConfig from "#/shared/datapi-config"
import { Nav } from "./Nav"

const SIDEBAR_ITEMS: SidebarItem[] = [
  // { id: 0, text: "خانه", icon: HouseLineIcon, url: routes.home },
  { id: 1, text: "محصولات", icon: StorefrontIcon, url: routes.base },
  { id: 2, text: "پروفایل", icon: UserCircleIcon, url: routes.profile },
  { id: 3, text: "مشاهده سفارشات", icon: ReceiptIcon, url: routes.orders },
  { id: 4, text: "شرایط و قوانین", icon: ScalesIcon, url: routes.rules },
  { id: 5, text: "درباره ما", icon: InfoIcon, url: routes.about },
  { id: 6, text: "مانده حساب", icon: CoinsIcon, url: routes.balance },
  { id: 7, text: "تنظیمات", icon: GearIcon, url: routes.settings },
]

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
  // Time fetch with proper cleanup
  useEffect(() => {
    apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/TyStocks/GetTime",
        onError: err =>
          notifManager.notify(parseError(err), ["console", "toast"], { status: "error" }),
      },
    })
  }, [])

  return null
}
