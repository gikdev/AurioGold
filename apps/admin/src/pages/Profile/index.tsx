import { HeadingLine } from "@repo/shared/layouts"
import ChangePasswordFormCard from "./ChangePasswordFormCard"
import ProfileSettingsFormCard from "./ProfileSettingsFormCard"

export default function Profile() {
  return (
    <HeadingLine title="پروفایل" className="flex flex-col gap-8">
      <ProfileSettingsFormCard />
      <ChangePasswordFormCard />
    </HeadingLine>
  )
}
