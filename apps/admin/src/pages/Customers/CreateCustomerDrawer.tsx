import { UserPlusIcon } from "@phosphor-icons/react"
import { postApiMasterAddCustomer } from "@repo/api-client/client"
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

function useCreateCustomerMutation() {
  return useMutation({
    mutationFn: async (data: CreateCustomerFormValues) => {
      const { reject, resolve } = createControlledAsyncToast({
        pending: "در حال ایجاد مشتری...",
        success: "مشتری با موفقیت ایجاد شد!",
      })

      try {
        await postApiMasterAddCustomer({ ...getHeaderTokenOnly(), body: data })
        resolve()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "خطایی رخ داد"
        reject(msg)
        throw err // rethrow for TanStack Query's onError
      }
    },
  })
}

interface CreateCustomerFormProps {
  reloadCustomers: () => void
}

function _CreateCustomerDrawer({ reloadCustomers }: CreateCustomerFormProps) {
  const [showCreateDrawer, setShowCreateDrawer] = useDrawerSheet(QUERY_KEYS.createNew)

  const form = useCustomForm(createCustomerSchema, emptyCustomerValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  const { mutate: createCustomer } = useCreateCustomerMutation()

  const onSubmit = async (data: CreateCustomerFormValues) => {
    createCustomer(data, {
      onSuccess: () => {
        reloadCustomers()
        setShowCreateDrawer(false)
        reset()
      },
    })
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
