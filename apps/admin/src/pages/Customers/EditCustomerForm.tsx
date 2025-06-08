import { UsersThreeIcon } from "@phosphor-icons/react"
import { DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { queryStateKeys } from "."

interface EditCustomerFormProps {
  reloadCustomers: () => void
}

export default function EditCustomerForm({ reloadCustomers }: EditCustomerFormProps) {
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
