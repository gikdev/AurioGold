import type { Icon } from "@phosphor-icons/react"
import { HouseIcon } from "@phosphor-icons/react/House"
import { XCircleIcon } from "@phosphor-icons/react/XCircle"
import { useAtom } from "jotai"
import { type ReactNode, useEffect } from "react"
import type { JSX } from "react"
import { Link, useLocation } from "react-router"
import { isSidebarOpenAtom } from "#shared/atoms"
import { ErrorCardBoundary } from "#shared/components"
import { Btn } from "#shared/components"
import { styled } from "#shared/helpers"

interface BaseProps {
  children: ReactNode
  nav: ReactNode
  sidebarItems: SidebarItem[]
}

export function Base({ children, nav, sidebarItems }: BaseProps) {
  useEffect(() => {
    // TODO
    const isLoggedIn = true
    if (!isLoggedIn) location.href = "/login"
  }, [])

  useEffect(() => {
    if (!("Notification" in window)) return
    Notification.requestPermission().catch(() => {})
  }, [])

  return (
    <>
      <header>{nav}</header>
      <main className="flex grow shrink">
        <Sidebar items={sidebarItems} />
        <section className="grow shrink flex flex-col">
          <ErrorCardBoundary>{children}</ErrorCardBoundary>
        </section>
      </main>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Sidebar and SidebarItem
// ─────────────────────────────────────────────────────────────

interface SidebarProps {
  items: SidebarItem[]
}

function Sidebar({ items }: SidebarProps): JSX.Element {
  const [isSidebarOpen, setSidebarOpen] = useAtom(isSidebarOpenAtom)

  const StyledAside = styled(
    "aside",
    "overflow-y-auto border-l border-slate-6 bg-slate-1 z-10",
    "flex flex-col px-4 py-8 gap-2",
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
    "text-slate-10 min-w-52 flex gap-2 py-3 px-4 rounded-lg items-center",
    "hover:bg-slate-3 hover:text-slate-12 active:scale-95 transition-all",
    { "bg-amber-9 text-slate-1 hover:text-slate-12 hover:bg-amber-8": isActive },
  )

  return (
    <StyledSidebarItem to={url}>
      <Icon weight={isActive ? "fill" : "regular"} size={24} />
      <span>{text}</span>
    </StyledSidebarItem>
  )
}
