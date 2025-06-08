import { UsersThreeIcon } from "@phosphor-icons/react"
import { DrawerSheet, useDrawerSheet } from "@repo/shared/components"
import { queryStateKeys } from "."

export default function CustomerForm() {
  const [isOpen, setOpen] = useDrawerSheet(queryStateKeys.createNew)

  return (
    <DrawerSheet
      open={isOpen}
      title="مشخصات مشتری"
      icon={UsersThreeIcon}
      onClose={() => setOpen(false)}
    >
      <form className="min-h-full flex flex-col gap-5">{/*   */}</form>
    </DrawerSheet>
  )
}
