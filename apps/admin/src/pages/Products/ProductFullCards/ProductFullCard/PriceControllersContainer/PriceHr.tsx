import { cx } from "#/shared/cva.config"

interface PriceHrProps {
  hideOnLargeScreens?: boolean
}

export function PriceHr({ hideOnLargeScreens = false }: PriceHrProps) {
  const className = cx(
    "h-[1px] w-full bg-slate-5 border-none",
    hideOnLargeScreens ? "xl:hidden" : "",
  )

  return <hr className={className} />
}
