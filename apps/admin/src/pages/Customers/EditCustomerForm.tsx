import { UsersThreeIcon } from "@phosphor-icons/react"
import { DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { queryStateKeys } from "."

export default function CustomerForm() {
  const [customerId, setCustomerId] = useDrawerSheetNumber(queryStateKeys.edit)

  return (
    <DrawerSheet
      onClose={() => setCustomerId(null)}
      open={customerId !== null}
      title="ویرایش مشتری"
      icon={UsersThreeIcon}
    >
      <form className="min-h-full flex flex-col gap-5">{/*  */}</form>
    </DrawerSheet>
  )
}
