import { HeadingLine } from "@repo/shared/layouts"
import EditAboutCard from "./EditAboutCard"
import EditMainPageContentCard from "./EditHomePageContentCard"
import EditRulesCard from "./EditRulesCard"
import UiSettingsCard from "./UiSettingsCard"

export default function Settings() {
  return (
    <HeadingLine title="تنظیمات" className="flex flex-col gap-8">
      <UiSettingsCard />
      <EditMainPageContentCard />
      <EditRulesCard />
      <EditAboutCard />
    </HeadingLine>
  )
}
