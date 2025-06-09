import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowRightIcon, UserPlusIcon } from "@phosphor-icons/react"
import type { PostApiMasterAddCustomerData } from "@repo/api-client/client"
import { Btn, DrawerSheet, useDrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."
import CustomerForm from "./CustomerForm"
import {
  type CreateCustomerFormValues,
  createCustomerSchema,
  emptyCustomerValues,
} from "./customerFormShared"

interface CreateCustomerFormProps {
  reloadCustomers: () => void
}

export default function CreateCustomerDrawer({ reloadCustomers }: CreateCustomerFormProps) {
  const [isOpen, setOpen] = useDrawerSheet(queryStateKeys.createNew)

  const form = useCustomForm(createCustomerSchema, emptyCustomerValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  const onSubmit = async (data: CreateCustomerFormValues) => {
    const dataToSend = convertFormValuesToApiPayload(data)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد مشتری...",
      success: "مشتری با موفقیت ایجاد شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/AddCustomer",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadCustomers()
          setOpen(false)
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
      open={isOpen}
      title="ایجاد مشتری جدید"
      icon={UserPlusIcon}
      onClose={() => setOpen(false)}
      btns={
        <>
          <Btn className="flex-1" onClick={() => setOpen(false)}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn
            className="flex-1"
            disabled={isSubmitting}
            theme="success"
            themeType="filled"
            onClick={submitTheFormManually}
          >
            <UserPlusIcon size={24} />
            <span>ایجاد</span>
          </Btn>
        </>
      }
    >
      <CustomerForm form={form} />
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: CreateCustomerFormValues,
): Required<PostApiMasterAddCustomerData["body"]> {
  return {
    displayName: values.displayName,
    mobile: values.phone,
    password: values.password,
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
  }
}
