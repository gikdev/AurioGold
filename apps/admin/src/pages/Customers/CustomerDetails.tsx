import { CoinsIcon, InfoIcon } from "@phosphor-icons/react"
import {
  Btn,
  BtnTemplates,
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { useAtomValue } from "jotai"
import { memo } from "react"
import { Link } from "react-router"
import { FileGuidLink } from "#/components"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { customersAtom } from "."
import { customerFormFields } from "./customerFormShared"
import { CustomerNavigation, QUERY_KEYS } from "./navigation"

const getLabelProperty = generateLabelPropertyGetter(customerFormFields.labels)

function _CustomerDetails() {
  const customers = useAtomValue(customersAtom)
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showDetailsDrawer, setShowDetailsDrawer] = useDrawerSheet(QUERY_KEYS.details)
  const customer = customers.find(c => c.id === customerId)

  if (!customerId) return null

  const handleClose = () => {
    setShowDetailsDrawer(false)
    setCustomerId(null)
  }

  const actions = (
    <div className="grid grid-cols-2 gap-2 p-2">
      <BtnTemplates.Cancel onClick={handleClose} />
      <Btn theme="info" as={Link} to={CustomerNavigation.balance(customerId)}>
        <CoinsIcon size={24} />
        <span>مانده حساب</span>
      </Btn>
      <BtnTemplates.Edit as={Link} to={CustomerNavigation.edit(customerId)} />
      <BtnTemplates.Delete as={Link} to={CustomerNavigation.delete(customerId)} />
    </div>
  )

  return (
    <DrawerSheet
      onClose={handleClose}
      open={customerId !== null && showDetailsDrawer}
      title="مشخصات مشتری"
      icon={InfoIcon}
      actions={actions}
    >
      {customer === undefined && <EntityNotFoundCard entity="مشتری" />}

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
      )}
    </DrawerSheet>
  )
}

const CustomerDetails = memo(_CustomerDetails)
export default CustomerDetails
