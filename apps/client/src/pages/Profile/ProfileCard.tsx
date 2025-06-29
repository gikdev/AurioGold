import { PasswordIcon, SignOutIcon, UserCircleIcon } from "@phosphor-icons/react"
import {
  Btn,
  BtnTemplates,
  KeyValueDetail,
  KeyValueDetailsContainer,
  TitledCard,
} from "@repo/shared/components"
import { formatPersianString } from "@repo/shared/utils"
import { useAtomValue } from "jotai"
import { memo } from "react"
import { Link } from "react-router"
import { profileAtom } from "#/atoms"
import { FileGuidLink } from "#/components"
import routes from "../routes"
import { Navigation } from "./navigation"

function _ProfileCard() {
  const profile = useAtomValue(profileAtom)

  return (
    <TitledCard
      title="پروفایل"
      icon={UserCircleIcon}
      titleSlot={
        <BtnTemplates.IconEdit
          as={Link}
          to={Navigation.changeProfile()}
          title="ویرایش پروفایل"
          className="ms-auto w-10 p-1"
        />
      }
    >
      <div className="flex flex-col gap-5">
        <div className="gap-3 flex flex-col items-center">
          <KeyValueDetailsContainer className="w-full">
            <KeyValueDetail title="نام" value={profile.displayName} />
            <KeyValueDetail title="تلفن" value={formatPersianString(profile.mobile ?? "")} />
            <KeyValueDetail title="کدملی" value={formatPersianString(profile.codeMelli ?? "")} />
            <KeyValueDetail title="شهر" value={formatPersianString(profile.city ?? "")} />
            <KeyValueDetail
              title="کارت ملی"
              cellRendered={<FileGuidLink guid={profile.melliID} />}
            />
            <KeyValueDetail
              title="جواز کسب"
              cellRendered={<FileGuidLink guid={profile.kasbsID} />}
            />
            <KeyValueDetail title="آدرس" value={formatPersianString(profile.address ?? "")} />
          </KeyValueDetailsContainer>
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
