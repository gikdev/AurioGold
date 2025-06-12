import { apiRequest } from "@gikdev/react-datapi/src"
import { UserPlusIcon } from "@phosphor-icons/react"
import type { CustomerDto, PostApiMasterUpdateCustomerData } from "@repo/api-client/client"
import { storageManager } from "@repo/shared/adapters"
import {
  BtnTemplates,
  DrawerSheet,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useAtomValue } from "jotai"
import { memo, useEffect } from "react"
import { EntityNotFoundCard } from "#/components"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { customersAtom } from "."
import CustomerForm from "./CustomerForm"
import {
  type EditCustomerFormValues,
  editCustomerSchema,
  emptyCustomerValues,
} from "./customerFormShared"
import { QUERY_KEYS } from "./navigation"

interface EditCustomerDrawerProps {
  reloadCustomers: () => void
}

function _EditCustomerDrawer({ reloadCustomers }: EditCustomerDrawerProps) {
  const customers = useAtomValue(customersAtom)
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showEditDrawer, setShowEditDrawer] = useDrawerSheet(QUERY_KEYS.edit)
  const customer = customers.find(c => c.id === customerId)

  const defaultValues = customer ? convertPartialCustomerDtoToFormValues(customer) : undefined

  const handleClose = () => {
    setCustomerId(null)
    setShowEditDrawer(false)
  }

  const form = useCustomForm(editCustomerSchema, emptyCustomerValues, true, defaultValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [reset, customer])

  const onSubmit = async (data: EditCustomerFormValues) => {
    if (customerId == null) return
    const dataToSend = convertFormValuesToApiPayload(data, customerId)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ویرایش مشتری...",
      success: "مشتری با موفقیت ویرایش شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/UpdateCustomer",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadCustomers()
          handleClose()
          reset()
        },
      },
    })
  }

  const submitTheFormManually = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  return (
    <DrawerSheet
      open={customerId != null && showEditDrawer}
      title="ویرایش مشتری"
      icon={UserPlusIcon}
      onClose={handleClose}
      btns={
        <>
          <BtnTemplates.Cancel onClick={handleClose} />
          <BtnTemplates.Edit
            disabled={isSubmitting}
            onClick={submitTheFormManually}
            themeType="filled"
          />
        </>
      }
    >
      {customer === undefined ? (
        <EntityNotFoundCard entity="مشتری" />
      ) : (
        <CustomerForm form={form} isEditMode />
      )}
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: EditCustomerFormValues,
  customerId: number,
): Required<PostApiMasterUpdateCustomerData["body"]> {
  return {
    displayName: values.displayName,
    mobile: values.phone,
    password: values.password || "",
    codeMelli: values.nationalId || "",
    groupID: values.groupId,
    groupIntID: values.numericGroupId,
    address: values.address || "",
    city: values.city || "",
    // TODO
    diffPrice: 0,
    melliID: values.nationalCard || null,
    kasbsID: values.businessLicense || null,
    isActive: values.isActive,
    isBlocked: values.isBlocked,
    allowedDevices: values.maxAllowedDevices || 1,
    accountingID: values.accountingId || "",
    id: customerId,
    masterID: toNullableNumber(storageManager.get("masterID", "sessionStorage")),
  }
}

function toNullableNumber(input: string | null | undefined) {
  if (!input) return null
  const convertedInput = Number(input)
  if (Number.isNaN(convertedInput)) return null
  return convertedInput
}

function convertPartialCustomerDtoToFormValues(
  dto: Partial<CustomerDto>,
): Partial<EditCustomerFormValues> {
  const obj: Partial<EditCustomerFormValues> = {}

  if (dto?.displayName) obj.displayName = dto.displayName
  if (dto?.mobile) obj.phone = dto.mobile
  if (dto?.allowedDevices != null) obj.maxAllowedDevices = dto.allowedDevices
  if (dto?.groupID != null && dto.groupID !== -1) obj.groupId = dto.groupID
  if (dto?.groupIntID != null && dto.groupIntID !== -1) obj.numericGroupId = dto.groupIntID
  if (dto?.isActive != null) obj.isActive = dto.isActive
  if (dto?.isBlocked != null) obj.isBlocked = dto.isBlocked
  if (dto?.address) obj.address = dto.address
  if (dto?.city) obj.city = dto.city
  if (dto?.accountingID) obj.accountingId = dto.accountingID
  if (dto?.codeMelli) obj.nationalId = dto.codeMelli
  if (dto?.melliID) obj.nationalCard = dto.melliID

  return obj
}

const EditCustomerDrawer = memo(_EditCustomerDrawer)
export default EditCustomerDrawer
