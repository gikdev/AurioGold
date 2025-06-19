import { LayoutIcon } from "@phosphor-icons/react"
import { type Theme, currentThemeAtom } from "@repo/shared/atoms"
import { LabelerLine, TitledCard, createSelectWithOptions } from "@repo/shared/components"
import { useAtom } from "jotai"

const themeOptions = [
  { id: "auto", title: "خودکار" },
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
  const [theme, setTheme] = useAtom(currentThemeAtom)

  return (
    <TitledCard title="تنظیمات رابط کاربری" icon={LayoutIcon}>
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
