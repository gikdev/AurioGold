import type { Icon } from "@phosphor-icons/react"
import type { ComponentProps, ReactNode } from "react"
import { Link } from "react-router"
import { useIsMobile } from "#shared/hooks"
import { Btn } from "./Btn"

interface FloatingActionBtnProps {
  fallback: ReactNode
  onClick?: () => void
  icon: Icon
  title?: string
  to?: string
  theme?: ComponentProps<typeof Btn>["theme"]
}

export function FloatingActionBtn({
  fallback,
  onClick,
  title,
  icon: IconToRender,
  theme = "primary",
  to,
}: FloatingActionBtnProps) {
  const isMobile = useIsMobile()

  if (!isMobile) return fallback

  return (
    <Btn
      type="button"
      as={to ? Link : "button"}
      to={to}
      title={title}
      onClick={onClick}
      className="w-14 h-14 p-1 absolute left-[8%] bottom-[8%] shadow-lg shadow-slate-12/20 z-[2]"
      theme={theme}
      themeType="filled"
    >
      <IconToRender size={32} />
    </Btn>
  )
}
