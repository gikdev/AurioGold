import { ArrowsLeftRightIcon, PlusIcon } from "@phosphor-icons/react"
import { postApiMasterAddAndAcceptDocsMutation } from "@repo/api-client"
import { DrawerSheet } from "@repo/shared/components"
import { notesHelpers, skins, useAppForm } from "@repo/shared/forms"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { MAX_FILE_SIZE_FOR_UPLOAD } from "@repo/shared/lib"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod/v4"
import { formErrors } from "#/shared/customForm"
import type { CustomerId } from "./store"

const imageNotes = [
  notesHelpers.generateAllowedExtensionsNote(["png", "jpg", "jpeg", "pdf"]),
  notesHelpers.generateFileSizeNote(MAX_FILE_SIZE_FOR_UPLOAD),
  notesHelpers.generateFileTypeNote("تصویر"),
]
const allowedTypes = ["image/jpg", "image/png", "image/jpeg", "application/pdf"]

const { fields, labels } = createFieldsWithLabels({
  mode: "حالت *",
  title: "عنوان *",
  docStr: "فایل سند *",
  amount: "مقدار (ریال) *",
})

const CustomerDocFormSchema = z.object({
  [fields.mode]: z.enum(["receive", "give"], formErrors.requiredField),
  [fields.title]: z.string().min(1, formErrors.requiredField),
  [fields.docStr]: z.string().min(1, formErrors.mustUploadFile),
  [fields.amount]: z.number().positive(formErrors.positive),
})
type CustomerDocFormValues = z.input<typeof CustomerDocFormSchema>

const emptyCustomerDocFormValues: CustomerDocFormValues = {
  mode: "receive",
  title: "",
  docStr: "",
  amount: 0,
}

const modeItems = [
  { id: "receive", value: "receive", title: "دریافتی" },
  { id: "give", value: "give", title: "پرداختی" },
]

interface CustomerDocDrawerProps {
  onClose: () => void
  customerId: CustomerId
}

export function CustomerDocDrawer({ onClose, customerId }: CustomerDocDrawerProps) {
  const { mutate: sendDoc } = useMutation(postApiMasterAddAndAcceptDocsMutation())

  const form = useAppForm({
    defaultValues: emptyCustomerDocFormValues,
    validators: {
      onChange: CustomerDocFormSchema,
      onMount: CustomerDocFormSchema,
    },

    onSubmit({ value, formApi }) {
      const { reject, resolve } = createControlledAsyncToast({
        pending: "در حال ثبت...",
        success: "با موفقیت ثبت شد!",
      })

      const onError = reject
      const onSuccess = () => {
        resolve()
        formApi.reset(emptyCustomerDocFormValues)
        onClose()
      }

      sendDoc(
        {
          body: {
            docId: value.docStr,
            title: value.title,
            tyCustomerID: customerId,
            tyOrderID: null,
            value: value.mode === "give" ? -value.amount : value.amount,
          },
        },
        { onError, onSuccess },
      )
    },
  })

  return (
    <DrawerSheet
      open
      title="دریافت و پرداخت (ریالی)"
      icon={ArrowsLeftRightIcon}
      onClose={onClose}
      btns={
        <form.AppForm>
          <form.Btn
            testId="customer-doc-drawer-submit-btn"
            Icon={PlusIcon}
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
      <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
        <form.AppField name="title">
          {field => <field.SimpleText label={labels.title} />}
        </form.AppField>

        <form.AppField name="mode">
          {field => <field.SimpleRadios label={labels.mode} items={modeItems} />}
        </form.AppField>

        <form.AppField name="amount">
          {field => <field.TomanField label={labels.amount} />}
        </form.AppField>

        <form.AppField name="docStr">
          {field => (
            <field.FileInput
              app="admin"
              label={labels.docStr}
              allowedTypes={allowedTypes}
              isPrivate
              mode="file"
              notes={imageNotes}
            />
          )}
        </form.AppField>
      </form>
    </DrawerSheet>
  )
}
