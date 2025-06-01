import type { Icon } from "@phosphor-icons/react"
import { HouseIcon } from "@phosphor-icons/react/House"
import { XCircleIcon } from "@phosphor-icons/react/XCircle"
import { useAtom } from "jotai"
import { type ReactNode, useEffect } from "react"
import type { JSX } from "react"
import { Link, useLocation } from "react-router"
import { storageManager } from "#shared/adapters"
import { isSidebarOpenAtom } from "#shared/atoms"
import { ErrorCardBoundary } from "#shared/components"
import { Btn } from "#shared/components"
import { styled } from "#shared/helpers"

function getIsLoggedIn() {
  return !!storageManager.get("ttkk", "sessionStorage")
}

interface BaseProps {
  children: ReactNode
  nav: ReactNode
  sidebarItems: SidebarItem[]
}

export function Base({ children, nav, sidebarItems }: BaseProps) {
  useEffect(() => {
    if (!getIsLoggedIn()) location.href = "/login"
  }, [])

  useEffect(() => {
    if (!("Notification" in window)) return
    Notification.requestPermission().catch(() => {})
  }, [])

  return (
    <>
      <header>{nav}</header>
      <main className="flex flex-1 gap-2 rounded-md overflow-hidden">
        <Sidebar items={sidebarItems} />
        <section className="flex-1 flex bg-slate-1 flex-col rounded-md overflow-y-auto">
          <ErrorCardBoundary>{children}</ErrorCardBoundary>
        </section>
      </main>
    </>
  )
}

// ─────────────────────────────────────────── //
// Sidebar                                     //
// ─────────────────────────────────────────── //

interface SidebarProps {
  items: SidebarItem[]
}

function Sidebar({ items }: SidebarProps): JSX.Element {
  const [isSidebarOpen, setSidebarOpen] = useAtom(isSidebarOpenAtom)

  const StyledAside = styled(
    "aside",
    "overflow-y-auto bg-slate-1 rounded-md",
    "flex flex-col p-2 gap-2 w-64",
    "[scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]",
    "inset-0 w-full max-w-full",
    "md:relative md:max-w-max md:flex",
    {
      hidden: !isSidebarOpen,
      fixed: isSidebarOpen,
    },
  )

  return (
    <StyledAside onClick={() => setSidebarOpen(false)}>
      <img
        className="inline-block max-h-16 mx-auto md:hidden max-w-max"
        src="/images/vgold-full.png"
        alt=""
      />

      {items.map(item => (
        <SidebarItem key={item.id} {...item} />
      ))}

      <Btn onClick={() => setSidebarOpen(false)} className="shrink-0 grow-0 mt-auto md:hidden">
        <XCircleIcon size={24} />
        <span>بستن</span>
      </Btn>
    </StyledAside>
  )
}

// ─────────────────────────────────────────── //
// SidebarItem                                 //
// ─────────────────────────────────────────── //

export interface SidebarItem {
  id: string | number
  text: string
  url: string
  icon?: Icon
}

interface SidebarItemProps extends Omit<SidebarItem, "id"> {}

function SidebarItem({ text = "---", icon: Icon = HouseIcon, url }: SidebarItemProps) {
  const { pathname } = useLocation()
  const isActive = pathname === url

  const StyledSidebarItem = styled(
    Link,
    "text-slate-10 min-w-52 flex gap-2 p-2 rounded-sm items-center relative",
    "hover:bg-slate-3 hover:text-slate-12 active:scale-95",
    isActive
      ? `
      font-bold text-brand-10 border-s-2
      rounded-tr-sm rounded-br-sm border-brand-10
      hover:bg-brand-3 hover:text-brand-11
    `
      : "",
  )

  return (
    <StyledSidebarItem to={url}>
      <Icon weight={isActive ? "fill" : "regular"} size={24} />
      <span>{text}</span>
    </StyledSidebarItem>
  )
}
