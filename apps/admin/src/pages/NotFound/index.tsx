import { ArrowLeftIcon, CoinVerticalIcon, HouseIcon, NumberFourIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import routes from "../routes"
import { Link } from "react-router"

export default function NotFound() {
  return (
    <div className="bg-slate-1 text-slate-11 flex flex-col items-center justify-center gap-5 text-center grow shrink">
      <div className="flex *:-mx-2">
        <NumberFourIcon size={64} className="text-amber-9" />
        <CoinVerticalIcon size={64} className="text-amber-9" />
        <NumberFourIcon size={64} className="text-amber-9" />
      </div>

      <p className="font-bold text-3xl text-slate-12">پیدا نشد!</p>

      <p>
        یا چیزی که دنبالش بودین رو نداریم،
        <br />
        یا اینکه اشتباه اومدین...
      </p>

      <Btn as={Link} to={routes.home} theme="info" themeType="outline">
        <HouseIcon size={24} />
        <span>بازگشت به خانه</span>
        <ArrowLeftIcon size={24} />
      </Btn>
    </div>
  )
}
