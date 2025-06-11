import { LayoutIcon } from "@phosphor-icons/react"
import { LabelerLine, Switch, TitledCard } from "@repo/shared/components"
import { useAtom } from "jotai"
import { showOnlineUsersInStatusbarAtom } from "#/atoms"

export default function UiSettingsCard() {
  const [showOnlineUsers, setShowOnlineUsers] = useAtom(showOnlineUsersInStatusbarAtom)

  return (
    <TitledCard title="تنظیمات رابط کاربری" icon={LayoutIcon}>
      <LabelerLine labelText="افراد آنلاین را در نوار وضعیت نمایش بده">
        <Switch checked={showOnlineUsers} onChange={e => setShowOnlineUsers(e.target.checked)} />
      </LabelerLine>
    </TitledCard>
  )
}
