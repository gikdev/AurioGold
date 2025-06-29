import { HeadingLine } from "@repo/shared/layouts"
import ChangePasswordDrawer from "./ChangePasswordDrawer"
import ProfileCard from "./ProfileCard"
import ProfileSettingsDrawer from "./ProfileSettingsDrawer"

export default function Profile() {
  return (
    <HeadingLine title="پروفایل" className="flex flex-col gap-8">
      <ProfileCard />
      <ProfileSettingsDrawer />
      <ChangePasswordDrawer />
    </HeadingLine>
  )
}
