import styled from "@master/styled.react"
import {
  ArrowClockwiseIcon,
  CircleNotchIcon,
  CloudCheckIcon,
  CloudSlashIcon,
  QuestionIcon,
  StorefrontIcon,
  UsersFourIcon,
} from "@phosphor-icons/react"
import { notifManager } from "@repo/shared/adapters"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import {
  connectionRefAtom,
  connectionStateAtom,
  isAdminOnlineAtom,
  onlineUsersCountAtom,
  showOnlineUsersInStatusbarAtom,
  useToggleAdminConnectivity,
} from "#/atoms"
import routes from "#/pages/routes"

export default function StatusBar() {
  return (
    <div className="w-full bg-slate-1 flex rounded-md h-8 gap-2 overflow-hidden">
      <OnlineUsers />

      <div className="flex items-center">
        <ReloadStatusBtn />
        <OnlinePeopleCount />
        <ServerConnectionStatus />
        <ToggleAdminOnline />
      </div>
    </div>
  )
}

function ToggleAdminOnline() {
  const toggleAdminConnectivity = useToggleAdminConnectivity()
  const isAdminOnline = useAtomValue(isAdminOnlineAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const isConnected = connectionState === "connected"
  const IconToRender = isConnected ? StorefrontIcon : CircleNotchIcon

  const StyledBtn = styled.button(
    "px-2 h-full",
    isConnected ? "cursor-pointer" : "cursor-not-allowed",
    isAdminOnline && isConnected
      ? "bg-green-3 hover:bg-green-4 text-green-11"
      : "hover:bg-slate-3 hover:text-slate-12",
  )

  const handleClick = () => {
    if (!isConnected) return
    toggleAdminConnectivity(!isAdminOnline)
  }

  return (
    <abbr title="آنلاین و آفلاین‌کردن فروشگاه" className="contents">
      <StyledBtn type="button" onClick={handleClick}>
        <IconToRender size={20} className={isConnected ? "" : "animate-spin"} />
      </StyledBtn>
    </abbr>
  )
}

function ServerConnectionStatus() {
  const connectionState = useAtomValue(connectionStateAtom)
  const isConnected = connectionState === "connected"
  let IconToRender = QuestionIcon

  if (connectionState === "connected") IconToRender = CloudCheckIcon
  if (connectionState === "disconnected") IconToRender = CloudSlashIcon
  if (connectionState === "loading") IconToRender = CircleNotchIcon

  const StyledElement = styled.div("px-2 items-center justify-center flex h-full", {
    "bg-green-2 text-green-11": isConnected,
    "bg-red-2 text-red-11": connectionState === "disconnected",
  })

  return (
    <abbr title="وضعیت اتصال به سرور" className="contents">
      <StyledElement>
        <IconToRender
          size={20}
          className={connectionState === "loading" ? "animate-spin" : undefined}
        />
      </StyledElement>
    </abbr>
  )
}

function OnlinePeopleCount() {
  const onlineUsersCount = useAtomValue(onlineUsersCountAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const isLoading = connectionState === "loading"
  const IconToRender = isLoading ? CircleNotchIcon : UsersFourIcon

  const StyledLink = styled(Link)(
    "px-2 items-center justify-center flex h-full gap-1 hover:bg-slate-3 hover:text-slate-12",
  )

  return (
    <abbr title={`تعداد افراد آنلاین: ${onlineUsersCount}`} className="contents no-underline">
      <StyledLink to={routes.onlineCount}>
        <IconToRender size={20} className={isLoading ? "animate-spin" : undefined} />
        <span>{onlineUsersCount}</span>
      </StyledLink>
    </abbr>
  )
}

function ReloadStatusBtn() {
  const StyledBtn = styled.button("px-2 h-full hover:bg-slate-3 hover:text-slate-12 cursor-pointer")

  const handleClick = () => {
    location.reload()
  }

  return (
    <abbr title="به‌روزرسانی صفحه" className="contents">
      <StyledBtn type="button" onClick={handleClick}>
        <ArrowClockwiseIcon size={20} />
      </StyledBtn>
    </abbr>
  )
}

function OnlineUsers() {
  const showOnlineUsersInStatusbar = useAtomValue(showOnlineUsersInStatusbarAtom)
  const connection = useAtomValue(connectionRefAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const setOnlineUsersCount = useSetAtom(onlineUsersCountAtom)
  const [onlineUsers, setOnlineUsers] = useState<Array<{ id: number; displayName: string }>>([])

  const getOnlineUsers = () => {
    if (!connection || connectionState !== "connected") return

    connection
      .invoke("GetConnectedUsers")
      .then(users => setOnlineUsers(users))
      .catch(() => notifManager.notify("یه مشکلی پیش آمده (E-AXE6785)", "console"))
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (connectionState === "connected" && connection) {
      getOnlineUsers()

      const onOnlineCount = (count: number) => {
        getOnlineUsers()
        setOnlineUsersCount(count || "؟")
      }

      connection.on("OnlineCount", onOnlineCount)

      return () => connection.off("OnlineCount")
    }

    return
  }, [connectionState])

  if (!showOnlineUsersInStatusbar) return null

  return (
    <div className="h-full flex items-center flex-1 text-xs">
      <div className="border-e border-slate-6 px-2 flex items-center gap-2">
        <div className="flex items-center">
          <i
            className="
              rounded-full bg-green-9 w-3 h-3 inline-block before:animate-ping relative
              before:rounded-full before:bg-green-9 before:w-3 before:h-3 before:inline-block before:absolute
             "
          />
        </div>
        <span className="font-bold">افراد آنلاین</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap flex-1 text-slate-11">
        <p className="w-full animate-marquee-fast md:animate-marquee-slow flex items-center gap-3">
          {onlineUsers.map((u, i) => (
            <span key={u.id} className="inline-block">
              {u.displayName}
              {onlineUsers.length === i + 1 ? "" : "،"}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
