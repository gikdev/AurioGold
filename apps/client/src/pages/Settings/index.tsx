import { HeadingLine } from "@repo/shared/layouts"
import UiSettingsCard from "./UiSettingsCard"

export default function Settings() {
  return (
    <HeadingLine title="تنظیمات" className="flex flex-col gap-8">
      <UiSettingsCard />
    </HeadingLine>
  )
}
