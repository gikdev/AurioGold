import { InfoIcon, ReceiptXIcon } from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { Link } from "react-router"
import { KeyValueDetail, KeyValueDetailsContainer } from "#/components"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { queryStateKeys, queryStateUrls } from "."
import { customerFormFields } from "./customerFormShared"

interface CustomerDetailsProps {
  customers: CustomerDto[]
}

const getLabelProperty = generateLabelPropertyGetter(customerFormFields.labels)

export default function CustomerDetails({ customers }: CustomerDetailsProps) {
  const [customerId, setCustomerId] = useDrawerSheetNumber(queryStateKeys.details)
  const customer = customers.find(c => c.id === customerId)

  const btns = (
    <>
      <BtnTemplates.Edit as={Link} to={queryStateUrls.edit(customerId!)} />
      <BtnTemplates.Delete as={Link} to={queryStateUrls.delete(customerId!)} />
    </>
  )

  return (
    <DrawerSheet
      onClose={() => setCustomerId(null)}
      open={customerId !== null}
      title="مشخصات مشتری"
      icon={InfoIcon}
      btns={btns}
    >
      {customer === undefined && (
        <div className="bg-red-2 border border-red-6 text-red-11 p-4 flex flex-col gap-2 items-center rounded-md">
          <ReceiptXIcon size={64} />
          <p className="text-xl font-bold text-red-12">پیدا نشد!</p>
          <p>مشتری مورد نظر پیدا نشد!</p>
        </div>
      )}
      {customer && (
        <KeyValueDetailsContainer
          className="flex flex-col gap-3"
          data-testid="customer-details-section"
        >
          <KeyValueDetail
            ltr
            title={getLabelProperty("accountingId")}
            value={customer.accountingID}
          />
          <KeyValueDetail title={getLabelProperty("address")} value={customer.address} />
          <KeyValueDetail
            ltr
            title={getLabelProperty("maxAllowedDevices")}
            value={customer.allowedDevices}
          />
          <KeyValueDetail title={getLabelProperty("city")} value={customer.city} />
          <KeyValueDetail ltr title={getLabelProperty("nationalId")} value={customer.codeMelli} />
          <KeyValueDetail ltr title="تعداد دستگاه‌های متصل" value={customer.connectedDevices} />
          <KeyValueDetail title={getLabelProperty("displayName")} value={customer.displayName} />
          <KeyValueDetail title={getLabelProperty("groupId")} value={customer.groupName} />
          <KeyValueDetail
            title={getLabelProperty("numericGroupId")}
            value={customer.groupIntName}
          />
          <KeyValueDetail ltr title={getLabelProperty("isActive")} value={customer.isActive} />
          <KeyValueDetail ltr title={getLabelProperty("isBlocked")} value={customer.isBlocked} />
          <KeyValueDetail title={getLabelProperty("businessLicense")} value={customer.kasbsID} />
          <KeyValueDetail title={getLabelProperty("nationalCard")} value={customer.melliID} />
          <KeyValueDetail ltr title={getLabelProperty("phone")} value={customer.mobile} />
          <KeyValueDetail ltr title="مستر آی‌دی" value={customer.masterID} />
          <KeyValueDetail ltr title="آی‌دی" value={customer.id} />
        </KeyValueDetailsContainer>
      )}
    </DrawerSheet>
  )
}
