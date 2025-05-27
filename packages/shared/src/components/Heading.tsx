import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "#shared/helpers"

// text-lg text-xl text-2xl text-3xl text-4xl text-5xl text-6xl text-7xl text-8xl text-9xl
// md:text-lg md:text-xl md:text-2xl md:text-3xl md:text-4xl md:text-5xl md:text-6xl md:text-7xl md:text-8xl md:text-9xl
function levelToClass(level: number): string {
  if (level < 0 || level > 9) return "text-red-9 bg-red-3"
  if (level === 0) return "text-md md:text-lg"
  if (level === 1) return "text-lg md:text-xl"
  if (level === 2) return "text-xl md:text-2xl"
  return `text-${level - 1}xl md:text-${level}xl`
}

interface HeadingProps extends HTMLAttributes<HTMLElement> {
  className?: string
  size?: number
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  children: ReactNode
}

export function Heading({
  className = "",
  size = 2,
  as: Tag = "h2",
  children,
  ...delegated
}: HeadingProps) {
  const styles = cn("font-bold", levelToClass(size), className)

  return (
    <Tag className={styles} {...delegated}>
      {children}
    </Tag>
  )
}
