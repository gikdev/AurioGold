import { CoinsIcon, InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client/client"
import {
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
} from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { FileGuidLink } from "#/components"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { customerFormFields } from "../-Customers/customerFormShared"
import { apiGetCustomersOptions } from "./shared"
import { type CustomerId, useCustomersStore } from "./store"

const getLabelProperty = generateLabelPropertyGetter(customerFormFields.labels)

interface CustomerDetailsDrawerProps {
  customerId: CustomerId
  onClose: () => void
}

export function CustomerDetailsDrawer({ customerId, onClose }: CustomerDetailsDrawerProps) {
  const { data: customers = [] } = useQuery(apiGetCustomersOptions)
  const customer = useMemo(() => customers.find(c => c.id === customerId), [customerId, customers])

  return (
    <DrawerSheet
      open
      icon={InfoIcon}
      onClose={onClose}
      title="مشخصات مشتری"
      btns={<Btns customerId={customerId} />}
    >
      {customer ? <CustomerDetails customer={customer} /> : <EntityNotFoundCard entity="مشتری" />}
    </DrawerSheet>
  )
}

const Btns = ({ customerId }: { customerId: CustomerId }) => (
  <>
    <button
      type="button"
      className={skins.btn({ intent: "info", className: "col-span-2" })}
      onClick={() => useCustomersStore.getState().balance(customerId)}
    >
      <CoinsIcon />
      <span>مانده حساب</span>
    </button>

    <button
      type="button"
      className={skins.btn({ intent: "warning" })}
      onClick={() => useCustomersStore.getState().edit(customerId)}
    >
      <PencilSimpleIcon />
      <span>ویرایش</span>
    </button>

    <button
      type="button"
      className={skins.btn({ intent: "error" })}
      onClick={() => useCustomersStore.getState().delete(customerId)}
    >
      <TrashIcon />
      <span>حذف</span>
    </button>
  </>
)

const CustomerDetails = ({ customer }: { customer: CustomerDto }) => (
  <KeyValueDetailsContainer className="flex flex-col gap-3">
    <KeyValueDetail ltr title={getLabelProperty("accountingId")} value={customer.accountingID} />
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
    <KeyValueDetail title={getLabelProperty("numericGroupId")} value={customer.groupIntName} />
    <KeyValueDetail ltr title={getLabelProperty("isActive")} value={customer.isActive} />
    <KeyValueDetail ltr title={getLabelProperty("isBlocked")} value={customer.isBlocked} />
    <KeyValueDetail
      title={getLabelProperty("businessLicense")}
      cellRendered={<FileGuidLink guid={customer.melliID} />}
    />
    <KeyValueDetail
      title={getLabelProperty("nationalCard")}
      cellRendered={<FileGuidLink guid={customer.kasbsID} />}
    />
    <KeyValueDetail ltr title={getLabelProperty("phone")} value={customer.mobile} />
    <KeyValueDetail ltr title="مستر آی‌دی" value={customer.masterID} />
    <KeyValueDetail ltr title="آی‌دی" value={customer.id} />
  </KeyValueDetailsContainer>
)
