import { CaretLeftIcon, PackageIcon } from "@phosphor-icons/react"
import type { StockDtoForMaster } from "@repo/api-client/client"
import { Link } from "react-router"
import { Navigation } from "../../navigation"

interface CardHeaderProps {
  id: NonNullable<StockDtoForMaster["id"]>
  name: NonNullable<StockDtoForMaster["name"]>
}

export function CardHeader({ id, name }: CardHeaderProps) {
  return (
    <Link
      to={Navigation.details(id)}
      className="flex items-center gap-1 hover:bg-slate-4 p-2 cursor-pointer"
    >
      <PackageIcon size={20} />
      <span>{name}</span>

      <CaretLeftIcon className="ms-auto" />
    </Link>
  )
}
