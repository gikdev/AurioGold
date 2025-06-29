import styled from "@master/styled.react"
import {
  ArrowClockwiseIcon,
  CircleNotchIcon,
  CloudCheckIcon,
  CloudSlashIcon,
  QuestionIcon,
  StorefrontIcon,
} from "@phosphor-icons/react"
import { AppInfoBtn } from "@repo/shared/components"
import { useAtomValue } from "jotai"
import { useEffect } from "react"
import { connectionStateAtom, isAdminOnlineAtom } from "#/atoms"
import appConfig from "../../config"

export default function StatusBar() {
  return (
    <div className="w-full bg-slate-1 flex flex-row-reverse rounded-md h-8 gap-2 overflow-hidden">
      <div className="flex-1" />

      <div className="flex items-center">
        <AppInfoBtn version={appConfig.versionStr} />
        <ShowShopStatus />
        <ServerConnectionStatus />
        <ReloadStatusBtn />
      </div>
    </div>
  )
}

function ShowShopStatus() {
  const isAdminOnline = useAtomValue(isAdminOnlineAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const isConnected = connectionState === "connected"
  const IconToRender = isConnected ? StorefrontIcon : CircleNotchIcon
  const title = isAdminOnline ? "فروشگاه آنلاین هست" : "فروشگاه آفلاین هست"

  const StyledDiv = styled.div(
    "px-2 h-full flex items-center justify-center",
    isAdminOnline && isConnected ? "bg-green-2 text-green-11" : "",
  )

  useEffect(() => {}, [])

  return (
    <abbr title={title} className="contents">
      <StyledDiv>
        <IconToRender size={20} className={isConnected ? "" : "animate-spin"} />
      </StyledDiv>
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
    <abbr title={isConnected ? "به سرور متصل هستیم" : "به سرور متصل نیستیم"} className="contents">
      <StyledElement>
        <IconToRender
          size={20}
          className={connectionState === "loading" ? "animate-spin" : undefined}
        />
      </StyledElement>
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
