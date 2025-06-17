import styled from "@master/styled.react"
import { DotsThreeCircleVerticalIcon, DotsThreeOutlineIcon, type Icon } from "@phosphor-icons/react"
import { HouseIcon } from "@phosphor-icons/react/House"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import type { JSX } from "react"
import { Link, useLocation } from "react-router"
import { storageManager } from "#shared/adapters"
import { DrawerSheet, ErrorCardBoundary } from "#shared/components"
import { cn } from "#shared/helpers"
import { getIsMobile, useBooleanishQueryState } from "#shared/hooks"

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
  const isMobile = useMemo(() => getIsMobile(), [])

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
        {isMobile ? <MobileSidebar items={sidebarItems} /> : <PCSidebar items={sidebarItems} />}

        <section className="flex-1 flex bg-slate-1 min-h-0 flex-col rounded-md overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
          <ErrorCardBoundary>{children}</ErrorCardBoundary>
        </section>
      </main>
      {footer}
    </>
  )
}

// ─────────────────────────────────────────── //
// MobileSidebar                               //
// ─────────────────────────────────────────── //

interface MobileSidebarProps {
  items: SidebarItem[]
}

function MobileSidebar({ items }: MobileSidebarProps) {
  const [isOpen, setOpen] = useBooleanishQueryState("menu")

  return (
    <DrawerSheet
      open={isOpen}
      title="منو"
      onClose={() => setOpen(false)}
      icon={DotsThreeCircleVerticalIcon}
    >
      <div className="flex flex-col p-2 ps-0 gap-2">
        {items.map(item => (
          <SidebarItem key={item.id} {...item} onClick={() => setOpen(false)} />
        ))}
      </div>
    </DrawerSheet>
  )
}

// ─────────────────────────────────────────── //
// PCSidebar                                   //
// ─────────────────────────────────────────── //

interface PCSidbarProps {
  items: SidebarItem[]
}

function PCSidebar({ items }: PCSidbarProps): JSX.Element {
  const StyledAside = styled.aside(
    "hidden overflow-y-auto bg-slate-1 rounded-md",
    "flex flex-col p-2 ps-0 gap-2 w-64",
    "[scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]",
    "inset-0 w-full max-w-full",
    "md:relative md:max-w-max md:flex",
  )

  return (
    <StyledAside>
      {items.map(item => (
        <SidebarItem key={item.id} {...item} />
      ))}
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

interface SidebarItemProps extends Omit<SidebarItem, "id"> {
  onClick?: () => void
}

function SidebarItem({ text = "---", icon: Icon = HouseIcon, url, onClick }: SidebarItemProps) {
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
    <Link to={url} className={classes} onClick={onClick}>
      <Icon weight={isActive ? "fill" : "regular"} size={24} />
      <span>{text}</span>
    </Link>
  )
}
