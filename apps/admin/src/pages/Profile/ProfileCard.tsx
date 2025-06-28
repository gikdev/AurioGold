import { PasswordIcon, SignOutIcon, UserCircleIcon } from "@phosphor-icons/react"
import { storageManager } from "@repo/shared/adapters"
import { Btn, TitledCard } from "@repo/shared/components"
import { memo } from "react"
import { Link } from "react-router"
import routes from "../routes"
import ProfileImage from "./ProfileImage"
import { Navigation } from "./navigation"

function getName() {
  return storageManager.get("name", "sessionStorage") || "---"
}

function _ProfileCard() {
  const name = getName()

  return (
    <TitledCard title="پروفایل" icon={UserCircleIcon}>
      <div className="flex flex-col gap-5">
        <div className="gap-3 flex flex-col items-center">
          <ProfileImage />

          <p className="text-3xl font-bold text-slate-12">{name}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Btn as={Link} to={Navigation.changePassword()}>
            <PasswordIcon size={24} />
            <span>تغییر رمز</span>
          </Btn>

          <Btn as={Link} to={routes.logout} theme="error">
            <SignOutIcon size={24} />
            <span>خروج از حساب</span>
          </Btn>
        </div>
      </div>
    </TitledCard>
  )
}

const ProfileCard = memo(_ProfileCard)
export default ProfileCard
