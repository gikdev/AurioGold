import { UserPlusIcon } from "@phosphor-icons/react"
import { postApiMasterAddCustomerMutation } from "@repo/api-client/tanstack"
import { BtnTemplates, DrawerSheet, useDrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { memo } from "react"
import { useCustomForm } from "#/shared/customForm"
import { getHeaderTokenOnly } from "#/shared/react-query"
import CustomerForm from "./CustomerForm"
import {
  type CreateCustomerFormValues,
  createCustomerSchema,
  emptyCustomerValues,
} from "./customerFormShared"
import { QUERY_KEYS } from "./navigation"

interface CreateCustomerFormProps {
  reloadCustomers: () => void
}

function _CreateCustomerDrawer({ reloadCustomers }: CreateCustomerFormProps) {
  const [showCreateDrawer, setShowCreateDrawer] = useDrawerSheet(QUERY_KEYS.createNew)

  const form = useCustomForm(createCustomerSchema, emptyCustomerValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  // const { mutate: createCustomer } = useCreateCustomerMutation()
  const { mutate: createCustomer } = useMutation(
    postApiMasterAddCustomerMutation(getHeaderTokenOnly()),
  )

  const onSubmit = async (data: CreateCustomerFormValues) => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد مشتری...",
      success: "مشتری با موفقیت ایجاد شد!",
    })

    createCustomer(
      { body: data },
      {
        onError: err => reject(err.message || String(err)),
        onSuccess: () => {
          resolve()
          reloadCustomers()
          setShowCreateDrawer(false)
          reset()
        },
      },
    )
  }

  const submitTheFormManually = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  return (
    <DrawerSheet
      open={showCreateDrawer}
      title="ایجاد مشتری جدید"
      icon={UserPlusIcon}
      onClose={() => setShowCreateDrawer(false)}
      btns={
        <>
          <BtnTemplates.Cancel onClick={() => setShowCreateDrawer(false)} />

          <BtnTemplates.Create
            disabled={isSubmitting}
            themeType="filled"
            onClick={submitTheFormManually}
          />
        </>
      }
    >
      <CustomerForm form={form} />
    </DrawerSheet>
  )
}

const CreateCustomerDrawer = memo(_CreateCustomerDrawer)
export default CreateCustomerDrawer
