import { ArrowsLeftRightIcon, PlusIcon } from "@phosphor-icons/react"
import { postApiMasterAddAndAcceptTransferMutation } from "@repo/api-client/tanstack"
import { notifManager } from "@repo/shared/adapters"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { DrawerSheet, LoadingSpinner } from "@repo/shared/components"
import { skins, useAppForm } from "@repo/shared/forms"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { z } from "zod/v4"
import { formErrors } from "#/shared/customForm"
import type { ProductId } from "../Products/ManageProducts/store"
import { apiGetCustomersOptions } from "./shared"
import type { CustomerId } from "./store"

const { fields, labels } = createFieldsWithLabels({
  mode: "حالت *",
  description: "توضیحات: ",
  volume: "مقدار *",
})

const CustomerTransferFormSchema = z.object({
  [fields.mode]: z.enum(["receive", "give"], formErrors.requiredField),
  [fields.description]: z.string(),
  [fields.volume]: z.number(formErrors.invalidInputType).positive(formErrors.positive),
})
type CustomerTransferFormValues = z.input<typeof CustomerTransferFormSchema>

const emptyCustomerTransferFormValues: CustomerTransferFormValues = {
  mode: "receive",
  volume: 0,
  description: "",
}

const modeItems = [
  { id: "receive", value: "receive", title: "دریافتی" },
  { id: "give", value: "give", title: "پرداختی" },
]

interface CustomerTransferDrawerProps {
  onClose: () => void
  customerId: CustomerId
  stockId: ProductId
}

export function CustomerTransferDrawer({
  onClose,
  customerId,
  stockId,
}: CustomerTransferDrawerProps) {
  const { data: customers = [] } = useQuery(apiGetCustomersOptions)
  const customer = useMemo(() => customers.find(c => c.id === customerId), [customerId, customers])
  const { mutate: sendTransfer } = useMutation(
    postApiMasterAddAndAcceptTransferMutation(getHeaderTokenOnly("admin")),
  )

  const form = useAppForm({
    defaultValues: emptyCustomerTransferFormValues,
    validators: {
      onChange: CustomerTransferFormSchema,
      onMount: CustomerTransferFormSchema,
    },

    onSubmit({ value, formApi }) {
      if (!customer) {
        notifManager.notify("اطلاعات مشتری لود نشده. ‌نمیتوان چیزی ثبت کرد.", "toast", {
          status: "error",
        })
        return
      }

      const { reject, resolve } = createControlledAsyncToast({
        pending: "در حال ثبت...",
        success: "با موفقیت ثبت شد!",
      })

      const onError = reject
      const onSuccess = () => {
        resolve()
        formApi.reset(emptyCustomerTransferFormValues)
        onClose()
      }

      sendTransfer(
        {
          body: {
            description: value.description || null,
            tyCustomerID: customerId,
            tyStockID: stockId,
            mobile: customer.mobile,
            volume: value.mode === "give" ? value.volume : -value.volume,
          },
        },
        { onError, onSuccess },
      )
    },
  })

  return (
    <DrawerSheet
      open
      title="دریافت و پرداخت طلایی"
      icon={ArrowsLeftRightIcon}
      onClose={onClose}
      btns={
        <form.AppForm>
          <form.Btn
            testId="customer-transfer-drawer-submit-btn"
            Icon={PlusIcon}
            disabled={!customer}
            title="ثبت"
            className={skins.btn({
              intent: "success",
              style: "filled",
              className: "col-span-2",
            })}
          />
        </form.AppForm>
      }
    >
      {customer ? (
        <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
          <form.AppField name="mode">
            {field => <field.SimpleRadios label={labels.mode} items={modeItems} />}
          </form.AppField>

          <form.AppField name="description">
            {field => <field.MultilineText label={labels.description} />}
          </form.AppField>

          <form.AppField name="volume">
            {field => <field.CommaField label={labels.volume} />}
          </form.AppField>
        </form>
      ) : (
        <LoadingSpinner />
      )}
    </DrawerSheet>
  )
}
