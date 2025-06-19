import { PasswordIcon, SignOutIcon, UserCircleIcon } from "@phosphor-icons/react"
import { Btn, BtnTemplates, TitledCard } from "@repo/shared/components"
import { useAtomValue } from "jotai"
import { type SyntheticEvent, memo } from "react"
import { Link } from "react-router"
import { profileAtom } from "#/atoms"
import routes from "../routes"
import { Navigation } from "./navigation"

const fallbackImageUrl = "https://placehold.co/400"

function handleImageLoadError(e: SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.onerror = null
  e.currentTarget.src = fallbackImageUrl
}

function _ProfileCard() {
  const profile = useAtomValue(profileAtom)
  const name = profile.displayName || "---"

  return (
    <TitledCard
      title="پروفایل"
      icon={UserCircleIcon}
      titleSlot={
        <BtnTemplates.IconEdit
          disabled
          title="ویرایش پروفایل - به زودی..."
          className="ms-auto w-10 p-1"
        />
      }
    >
      <div className="flex flex-col gap-5">
        <div className="gap-3 flex flex-col items-center">
          <img
            src={fallbackImageUrl}
            alt="عکس پروفایل"
            className="w-full max-w-60 block rounded-full"
            onError={handleImageLoadError}
          />

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
