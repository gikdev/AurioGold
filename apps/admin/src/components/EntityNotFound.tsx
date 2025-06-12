import { WarningDiamondIcon } from "@phosphor-icons/react"

interface EntityNotFoundCardProps {
  entity: string
}

export function EntityNotFoundCard({ entity = "آیتم" }: EntityNotFoundCardProps) {
  return (
    <div className="bg-red-2 border border-red-6 text-red-11 p-4 flex flex-col gap-2 items-center rounded-md">
      <WarningDiamondIcon size={64} />
      <p className="text-xl font-bold text-red-12">پیدا نشد!</p>
      <p>{entity} مورد نظر پیدا نشد!</p>
    </div>
  )
}
