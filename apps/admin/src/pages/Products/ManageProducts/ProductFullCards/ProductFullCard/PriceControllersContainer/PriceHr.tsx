import { cx } from "#/shared/cva.config"

interface PriceHrProps {
  hasVertical?: boolean
}

export function PriceHr({ hasVertical = false }: PriceHrProps) {
  const className = cx(
    "h-[1px] w-full bg-slate-5 border-none",
    hasVertical ? "xl:h-8 xl:w-[1px]" : "",
  )

  return <hr className={className} />
}
