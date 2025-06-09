import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowRightIcon, PenIcon, ReceiptXIcon, UserPlusIcon } from "@phosphor-icons/react"
import type { CustomerDto, PostApiMasterUpdateCustomerData } from "@repo/api-client/client"
import { storageManager } from "@repo/shared/adapters"
import { Btn, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useEffect } from "react"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."
import CustomerForm from "./CustomerForm"
import {
  type EditCustomerFormValues,
  editCustomerSchema,
  emptyCustomerValues,
} from "./customerFormShared"

interface EditCustomerDrawerProps {
  reloadCustomers: () => void
  customers: CustomerDto[]
}

export default function EditCustomerDrawer({
  reloadCustomers,
  customers,
}: EditCustomerDrawerProps) {
  const [customerId, setCustomerId] = useDrawerSheetNumber(queryStateKeys.edit)
  const customer = customers.find(c => c.id === customerId)

  const defaultValues = customer ? convertPartialCustomerDtoToFormValues(customer) : undefined

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
          setCustomerId(null)
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
      open={customerId != null}
      title="ویرایش مشتری"
      icon={UserPlusIcon}
      onClose={() => setCustomerId(null)}
      btns={
        <>
          <Btn className="flex-1" onClick={() => setCustomerId(null)}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn
            className="flex-1"
            disabled={isSubmitting}
            theme="warning"
            themeType="filled"
            onClick={submitTheFormManually}
          >
            <PenIcon size={24} />
            <span>ویرایش</span>
          </Btn>
        </>
      }
    >
      {customer === undefined ? (
        <div className="bg-red-2 border border-red-6 text-red-11 p-4 flex flex-col gap-2 items-center rounded-md">
          <ReceiptXIcon size={64} />
          <p className="text-xl font-bold text-red-12">پیدا نشد!</p>
          <p>مشتری مورد نظر پیدا نشد!</p>
        </div>
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
