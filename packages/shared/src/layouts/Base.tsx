import styled from "@master/styled.react"
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
import { cn } from "#shared/helpers"

function getIsLoggedIn() {
  return !!storageManager.get("ttkk", "sessionStorage")
}

interface BaseProps {
  nav: ReactNode
  children: ReactNode
  sidebarItems: SidebarItem[]
  footer: ReactNode
}

export function Base({ children, nav, footer, sidebarItems }: BaseProps) {
  useEffect(() => {
    if (!getIsLoggedIn()) location.href = "/login"
  }, [])

  useEffect(() => {
    if (!("Notification" in window)) return
    Notification.requestPermission().catch(() => {})
  }, [])

  return (
    <>
      {nav}
      <main className="flex flex-1 gap-2 rounded-md overflow-hidden">
        <Sidebar items={sidebarItems} />
        <section className="flex-1 flex bg-slate-1 flex-col rounded-md overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
          <ErrorCardBoundary>{children}</ErrorCardBoundary>
        </section>
      </main>
      {footer}
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

  const StyledAside = styled.aside(
    "overflow-y-auto bg-slate-1 rounded-md",
    "flex flex-col p-2 ps-0 gap-2 w-64",
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

  const classes = cn(
    "text-slate-10 min-w-52 flex gap-2 p-2 rounded-sm items-center relative",
    "hover:bg-slate-3 hover:text-slate-12 active:scale-95 ms-2",
    {
      "font-bold text-brand-10 border-s-2 ps-4 rounded-tr-none rounded-br-none border-brand-10 hover:bg-brand-3 hover:text-brand-11 ms-0":
        isActive,
    },
  )

  return (
    <Link to={url} className={classes}>
      <Icon weight={isActive ? "fill" : "regular"} size={24} />
      <span>{text}</span>
    </Link>
  )
}
