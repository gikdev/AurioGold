import { LayoutIcon } from "@phosphor-icons/react"
import { currentThemeAtom, type Theme } from "@repo/shared/atoms"
import { createSelectWithOptions, LabelerLine, Switch, TitledCard } from "@repo/shared/components"
import { useAtom } from "jotai"
import { showOnlineUsersInStatusbarAtom } from "#/atoms"

const themeOptions = [
  { id: "dark", title: "تاریک" },
  { id: "light", title: "روشن" },
]

const SelectWithThemeOptions = createSelectWithOptions<(typeof themeOptions)[number]>()

const keysConfig = {
  id: "id",
  text: "title",
  value: "id",
} as const

export default function UiSettingsCard() {
  const [showOnlineUsers, setShowOnlineUsers] = useAtom(showOnlineUsersInStatusbarAtom)
  const [theme, setTheme] = useAtom(currentThemeAtom)

  return (
    <TitledCard title="تنظیمات رابط کاربری" icon={LayoutIcon}>
      <LabelerLine labelText="افراد آنلاین را در نوار وضعیت نمایش بده">
        <Switch checked={showOnlineUsers} onChange={e => setShowOnlineUsers(e.target.checked)} />
      </LabelerLine>

      <LabelerLine labelText="تم برنامه">
        <SelectWithThemeOptions
          options={themeOptions}
          keys={keysConfig}
          value={theme}
          onChange={e => setTheme(e.target.value as Theme)}
        />
      </LabelerLine>
    </TitledCard>
  )
}
