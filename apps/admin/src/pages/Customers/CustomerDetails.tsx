import { InfoIcon } from "@phosphor-icons/react"
import { DrawerSheet, useDrawerSheetNumber } from "./DrawerSheet"

export default function CustomerDetails() {
  const [customerId, setCustomerId] = useDrawerSheetNumber("details")

  return (
    <DrawerSheet
      onClose={() => setCustomerId(null)}
      open={customerId !== null}
      title="مشخصات مشتری"
      icon={InfoIcon}
    >
      lakjsdflkjsdafljsadflkj
    </DrawerSheet>
  )
}
